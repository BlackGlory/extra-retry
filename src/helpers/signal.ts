import { IPredicate } from '@src/types.js'

export function signal(abortSignal: AbortSignal): IPredicate<boolean> {
  return () => abortSignal.aborted
}
