import { IPredicate } from './types.js'
import { Awaitable } from 'justypes'
import { retryIterableUntil } from './retry-iterable-until.js'

export function withRetryIterableUntil(
  predicate: IPredicate
): <Args extends unknown[], Value>(
  fn: (...args: Args) => Awaitable<Iterable<Value> | AsyncIterable<Value>>
) => (...args: Args) => AsyncIterableIterator<Awaited<Value>>
export function withRetryIterableUntil<Args extends unknown[], Value>(
  predicate: IPredicate
, fn: (...args: Args) => Awaitable<Iterable<Value> | AsyncIterable<Value>>
): (...args: Args) => AsyncIterableIterator<Awaited<Value>>
export function withRetryIterableUntil<Args extends unknown[], Value>(...args:
| [predicate: IPredicate]
| [
    predicate: IPredicate
  , fn: (...args: Args) => Awaitable<Iterable<Value> | AsyncIterable<Value>>
  ]
) {
  if (args.length === 1) return withRetryIterableUntil.bind(null, ...args)

  const [predicate, fn] = args
  const withRetry = retryIterableUntil(predicate)

  return function (this: unknown, ...args: Args): AsyncIterableIterator<Value> {
    return withRetry(() => Reflect.apply(fn, this, args))
  }
}
