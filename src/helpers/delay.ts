import { IPredicate } from '@src/types.js'
import * as ExtraPromise from 'extra-promise'

export function delay(ms: number): IPredicate<boolean> {
  return async () => {
    await ExtraPromise.delay(ms)
    return false
  }
}
