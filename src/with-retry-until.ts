import { IPredicate } from './types.js'
import { Awaitable } from 'justypes'
import { retryUntil } from './retry-until.js'

export function withRetryUntil<Args extends unknown[], Result>(
  predicate: IPredicate
, fn: (...args: Args) => Awaitable<Result>
): (...args: Args) => Promise<Result> {
  const withRetry = retryUntil(predicate)

  return function (this: unknown, ...args: Args): Promise<Result> {
    return withRetry(() => Reflect.apply(fn, this, args))
  }
}
