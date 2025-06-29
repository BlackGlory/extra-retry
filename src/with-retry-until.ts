import { IPredicate } from './types.js'
import { Awaitable } from 'justypes'
import { retryUntil } from './retry-until.js'

export function withRetryUntil(
  predicate: IPredicate
): <Args extends unknown[], Result>(...args: Args) => Promise<Result>
export function withRetryUntil<Args extends unknown[], Result>(
  predicate: IPredicate
, fn: (...args: Args) => Awaitable<Result>
): (...args: Args) => Promise<Result>
export function withRetryUntil<Args extends unknown[], Result>(...args:
| [predicate: IPredicate]
| [predicate: IPredicate, fn: (...args: Args) => Awaitable<Result>]
) {
  if (args.length === 1) return withRetryUntil.bind(null, ...args)

  const [predicate, fn] = args
  const withRetry = retryUntil(predicate)

  return function (this: unknown, ...args: Args): Promise<Result> {
    return withRetry(() => Reflect.apply(fn, this, args))
  }
}
