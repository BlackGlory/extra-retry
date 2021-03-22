import { IPredicate } from '@src/types'

export function anyOf(...predicates: IPredicate[]): IPredicate<boolean> {
  return async context => {
    for (const predicate of predicates) {
      if (await predicate(context)) {
        return true
      }
    }
    return false
  }
}
