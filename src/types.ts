export interface IContext {
  error: Error
  retries: number
}

export type IPredicate<T = unknown> = (context: IContext) => T | PromiseLike<T>
