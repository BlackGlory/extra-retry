import { IPredicate } from '@src/types'

export function signal(abortSignal: AbortSignal): IPredicate<boolean> {
  return () => abortSignal.aborted
}
