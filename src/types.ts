import { Awaitable } from 'justypes'

export interface IContext {
  error: unknown
  retries: number
}

export type IPredicate<T = unknown> = (context: IContext) => Awaitable<T>
