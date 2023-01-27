import { IPredicate } from '@src/types.js'

export function maxRetries(times: number): IPredicate<boolean> {
  return ({ retries }) => retries >= times
}
