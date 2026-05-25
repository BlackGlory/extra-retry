import { IPredicate, IContext } from './types.js'
import { go } from '@blackglory/prelude'
import { Awaitable } from 'justypes'

export function retryIterableUntil(
  predicate: IPredicate
): <T>(
  fn: () => Awaitable<Iterable<T> | AsyncIterable<T>>
) => AsyncIterableIterator<Awaited<T>>
export function retryIterableUntil<T>(
  predicate: IPredicate
, fn: () => Awaitable<Iterable<T> | AsyncIterable<T>>
): AsyncIterableIterator<Awaited<T>>
export function retryIterableUntil<T>(...args:
| [predicate: IPredicate]
| [predicate: IPredicate, fn: () => Awaitable<Iterable<T> | AsyncIterable<T>>]
) {
  if (args.length === 1) return retryIterableUntil.bind(null, ...args)

  return go(async function* (): AsyncIterableIterator<Awaited<T>> {
    const [predicate, fn] = args

    let retries = 0
    while (true) {
      try {
        yield* await fn()
        return
      } catch (error: unknown) {
        const context: IContext = { error, retries }

        if (await predicate(context)) throw error

        retries++
      }
    }
  })
}
