import { Constructor } from 'justypes'
import { IPredicate } from '@src/types'

export function notRetryOn(errors: Array<Constructor<Error>>): IPredicate<boolean> {
  return ({ error }) => errors.some(x => error instanceof x)
}
