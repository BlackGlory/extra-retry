import { withRetryUntil } from '@src/with-retry-until.js'
import { getErrorPromise } from 'return-style'
import { jest } from '@jest/globals'

describe('withRetryUntil', () => {
  test('resolved', async () => {
    const value = 'value'
    const error = new Error('CustomError')
    const fn = jest.fn<() => Promise<string>>()
      .mockRejectedValueOnce(error)
      .mockResolvedValue(value)
    const predicate = jest.fn()
      .mockReturnValue(false)

    const fnWithRetry = withRetryUntil(predicate, fn)
    const result = await fnWithRetry()

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

    const fnWithRetry = withRetryUntil(predicate, fn)
    const err = await getErrorPromise(fnWithRetry())

    expect(fn).toBeCalledTimes(2)
    expect(predicate).toBeCalledTimes(2)
    expect(predicate).nthCalledWith(1, { error, retries: 0 })
    expect(predicate).nthCalledWith(2, { error, retries: 1 })
    expect(err).toBe(error)
  })
})
