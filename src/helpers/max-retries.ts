import { IPredicate } from '@src/types'

export function maxRetries(times: number): IPredicate<boolean> {
  return ({ retries }) => retries >= times
}
