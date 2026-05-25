import { describe, test, expect, vi } from 'vitest'
import { retryUntil } from '@src/retry-until.js'
import { getErrorPromise } from 'return-style'
import { IPredicate } from '@src/types.js'
import { Awaitable } from 'justypes'

describe.each([
  (predicate: IPredicate, fn: () => Awaitable<unknown>) => retryUntil(predicate)(fn)
, (predicate: IPredicate, fn: () => Awaitable<unknown>) => retryUntil(predicate, fn)
])('retryUntil', retryUntil => {
  test('resolved', async () => {
    const value = 'value'
    const error = new Error('CustomError')
    const fn = vi.fn<() => Promise<string>>()
      .mockRejectedValueOnce(error)
      .mockResolvedValue(value)
    const predicate = vi.fn()
      .mockReturnValue(false)

    const result = await retryUntil(predicate, fn)

    expect(fn).toHaveBeenCalledTimes(2)
    expect(predicate).toHaveBeenCalledTimes(1)
    expect(predicate).toHaveBeenCalledWith({ error, retries: 0 })
    expect(result).toBe(value)
  })

  test('rejected', async () => {
    const error = new Error('CustomError')
    const fn = vi.fn<() => never>()
      .mockRejectedValue(error)
    const predicate = vi.fn<() => boolean>()
      .mockReturnValueOnce(false)
      .mockReturnValue(true)

    const err = await getErrorPromise(retryUntil(predicate, fn))

    expect(fn).toHaveBeenCalledTimes(2)
    expect(predicate).toHaveBeenCalledTimes(2)
    expect(predicate).nthCalledWith(1, { error, retries: 0 })
    expect(predicate).nthCalledWith(2, { error, retries: 1 })
    expect(err).toBe(error)
  })
})
