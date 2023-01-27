import { IContext, IPredicate } from '@src/types.js'

export function tap(fn: (context: IContext) => void): IPredicate<false> {
  return (context: IContext): false => {
    fn(context)
    return false
  }
}
