import { retryUntil } from '@src/retry-until.js'
import { getErrorPromise } from 'return-style'
import { jest } from '@jest/globals'
import { IPredicate } from '@src/types.js'
import { Awaitable } from 'justypes'

describe.each([
  (predicate: IPredicate, fn: () => Awaitable<unknown>) => retryUntil(predicate)(fn)
, (predicate: IPredicate, fn: () => Awaitable<unknown>) => retryUntil(predicate, fn)
])('retryUntil', retryUntil => {
  test('resolved', async () => {
    const value = 'value'
    const error = new Error('CustomError')
    const fn = jest.fn<() => Promise<string>>()
      .mockRejectedValueOnce(error)
      .mockResolvedValue(value)
    const predicate = jest.fn()
      .mockReturnValue(false)

    const result = await retryUntil(predicate, fn)

    expect(fn).toBeCalledTimes(2)
    expect(predicate).toBeCalledTimes(1)
    expect(predicate).toBeCalledWith({ error, retries: 0 })
    expect(result).toBe(value)
  })

  test('rejected', async () => {
    const error = new Error('CustomError')
    const fn = jest.fn<() => never>()
      .mockRejectedValue(error)
    const predicate = jest.fn<() => boolean>()
      .mockReturnValueOnce(false)
      .mockReturnValue(true)

    const err = await getErrorPromise(retryUntil(predicate, fn))

    expect(fn).toBeCalledTimes(2)
    expect(predicate).toBeCalledTimes(2)
    expect(predicate).nthCalledWith(1, { error, retries: 0 })
    expect(predicate).nthCalledWith(2, { error, retries: 1 })
    expect(err).toBe(error)
  })
})
