import { Constructor } from 'justypes'
import { IPredicate } from '@src/types.js'

export function retryOn(errors: Array<Constructor<Error>>): IPredicate<boolean> {
  return ({ error }) => !(errors.some(x => error instanceof x))
}
