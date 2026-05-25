import { test, expect, vi } from 'vitest'
import { withRetryUntil } from '@src/with-retry-until.js'
import { IPredicate } from '@src/types.js'
import { Awaitable } from 'justypes'

test.each([
  <Args extends unknown[], Result>(
    predicate: IPredicate
  , fn: (...args: Args) => Awaitable<Result>
  ) => withRetryUntil(predicate)(fn)
, <Args extends unknown[], Result>(
    predicate: IPredicate
  , fn: (...args: Args) => Awaitable<Result>
  ) => withRetryUntil(predicate, fn)
])('withRetryUntil', async withRetryUntil => {
  const error = new Error('CustomError')
  let runs = 0
  const fn = vi.fn<(value: string) => Promise<string>>(async (value: string) => {
    if (++runs === 1) {
      throw error
    } else {
      return value
    }
  })
  const predicate = vi.fn()
    .mockReturnValue(false)

  const fnWithRetry = withRetryUntil(predicate, fn)
  const result = await fnWithRetry('foo')

  expect(fn).toHaveBeenCalledTimes(2)
  expect(fn).nthCalledWith(1, 'foo')
  expect(fn).nthCalledWith(2, 'foo')
  expect(predicate).toHaveBeenCalledTimes(1)
  expect(predicate).toHaveBeenCalledWith({ error, retries: 0 })
  expect(result).toBe('foo')
})
