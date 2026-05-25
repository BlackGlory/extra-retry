import { test, expect, vi } from 'vitest'
import { withRetryIterableUntil } from '@src/with-retry-iterable-until.js'
import { IPredicate } from '@src/types.js'
import { Awaitable } from 'justypes'
import { go, toArrayAsync } from '@blackglory/prelude'

test.each([
  <Args extends unknown[], Value>(
    predicate: IPredicate
  , fn: (...args: Args) => Awaitable<Iterable<Value> | AsyncIterable<Value>>
  ) => withRetryIterableUntil(predicate)(fn)
, <Args extends unknown[], Value>(
    predicate: IPredicate
  , fn: (...args: Args) => Awaitable<Iterable<Value> | AsyncIterable<Value>>
  ) => withRetryIterableUntil(predicate, fn)
])('withRetryIterableUntil', async withRetryIterableUntil => {
  const error = new Error('CustomError')
  let runs = 0
  const fn = vi.fn<(value: string) => Promise<AsyncIterable<string>>>((value: string) => {
    return Promise.resolve(go(async function* () {
      runs++

      yield Promise.resolve('foo')

      switch (runs) {
        case 1: {
          yield Promise.resolve('bar')

          throw error
        }
        case 2: {
          yield Promise.resolve('baz')
          yield Promise.reject(error)

          process.exit()

          break
        }
        default: yield Promise.resolve(value)
      }
    }))
  })
  const predicate = vi.fn()
    .mockReturnValue(false)

  const fnWithRetry = withRetryIterableUntil(predicate, fn)
  const result = await toArrayAsync(fnWithRetry('qux'))

  expect(fn).toHaveBeenCalledTimes(3)
  expect(fn).nthCalledWith(1, 'qux')
  expect(fn).nthCalledWith(2, 'qux')
  expect(fn).nthCalledWith(3, 'qux')
  expect(predicate).toHaveBeenCalledTimes(2)
  expect(predicate).nthCalledWith(1, { error, retries: 0 })
  expect(predicate).nthCalledWith(2, { error, retries: 1 })
  expect(result).toStrictEqual(['foo', 'bar', 'foo', 'baz', 'foo', 'qux'])
})
