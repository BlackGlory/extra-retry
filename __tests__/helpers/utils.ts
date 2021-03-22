import { IContext } from '@src/types'

export const TIME_ERROR = 1

export function createContext(context: Partial<IContext> = {}): IContext {
  return {
    error: new Error('custom error')
  , retries: 0
  , ...context
  }
}

export function getTimestamp(): number {
  return Date.now()
}
