export interface IContext {
  error: unknown
  retries: number
}

export type IPredicate<T = unknown> = (context: IContext) => T | PromiseLike<T>
