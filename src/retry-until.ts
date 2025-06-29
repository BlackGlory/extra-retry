import { IPredicate, IContext } from './types.js'
import { go } from '@blackglory/go'
import { Awaitable } from 'justypes'

export function retryUntil(
  predicate: IPredicate
): <T>(fn: () => Awaitable<T>) => Promise<T>
export function retryUntil<T>(
  predicate: IPredicate
, fn: () => Awaitable<T>
): Promise<T>
export function retryUntil<T>(...args:
| [predicate: IPredicate]
| [predicate: IPredicate, fn: () => Awaitable<T>]
) {
  if (args.length === 1) return retryUntil.bind(null, ...args)

  return go(async () => {
    const [predicate, fn] = args

    let retries = 0
    while (true) {
      try {
        return await fn()
      } catch (error: unknown) {
        const context: IContext = { error, retries }

        if (await predicate(context)) throw error

        retries++
      }
    }
  })
}
