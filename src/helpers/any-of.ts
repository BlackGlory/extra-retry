import { Falsy } from 'justypes'
import { IPredicate } from '@src/types'

export function anyOf(...predicates: Array<IPredicate | Falsy>): IPredicate<boolean> {
  return async context => {
    for (const predicate of predicates) {
      if (predicate && await predicate(context)) {
        return true
      }
    }
    return false
  }
}
