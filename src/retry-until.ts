import { IPredicate, IContext } from './types'
import { go } from '@blackglory/go'

export function retryUntil(predicate: IPredicate): <T>(fn: () => T | PromiseLike<T>) => Promise<T>
export function retryUntil<T>(predicate: IPredicate, fn: () => T | PromiseLike<T>): Promise<T>
export function retryUntil<T>(...args:
| [predicate: IPredicate]
| [predicate: IPredicate, fn: () => T | PromiseLike<T>]
) {
  if (args.length === 1) return retryUntil.bind(null, ...args)

  return go(async () => {
    const [predicate, fn] = args

    let retries = 0
    while (true) {
      try {
        return await fn()
      } catch (error: any) {
        const context: IContext = { error, retries }

        if (await predicate(context)) throw error

        retries++
      }
    }
  })
}
