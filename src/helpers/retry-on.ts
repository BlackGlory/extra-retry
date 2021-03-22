import { Constructor } from 'hotypes'
import { IPredicate } from '@src/types'

export function retryOn(errors: Array<Constructor<Error>>): IPredicate<boolean> {
  return ({ error }) => !(errors.some(x => error instanceof x))
}
