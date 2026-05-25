import { describe, test, expect, vi } from 'vitest'
import { withRetryUntil } from '@src/with-retry-until.js'
import { getErrorPromise } from 'return-style'
import { IPredicate } from '@src/types.js'
import { Awaitable } from 'justypes'

describe.each([
  (
    predicate: IPredicate
  , fn: (...args: unknown[]) => Awaitable<unknown>
  ) => withRetryUntil(predicate)(fn)
, (
    predicate: IPredicate
  , fn: (...args: unknown[]) => Awaitable<unknown>
  ) => withRetryUntil(predicate, fn)
])('withRetryUntil', withRetryUntil => {
  test('resolved', async () => {
    const value = 'value'
    const error = new Error('CustomError')
    const fn = vi.fn<() => Promise<string>>()
      .mockRejectedValueOnce(error)
      .mockResolvedValue(value)
    const predicate = vi.fn()
      .mockReturnValue(false)

    const fnWithRetry = withRetryUntil(predicate, fn)
    const result = await fnWithRetry()

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

    const fnWithRetry = withRetryUntil(predicate, fn)
    const err = await getErrorPromise(fnWithRetry())

    expect(fn).toHaveBeenCalledTimes(2)
    expect(predicate).toHaveBeenCalledTimes(2)
    expect(predicate).nthCalledWith(1, { error, retries: 0 })
    expect(predicate).nthCalledWith(2, { error, retries: 1 })
    expect(err).toBe(error)
  })
})
