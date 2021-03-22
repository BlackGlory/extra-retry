import { IPredicate } from '@src/types'
import { delay } from 'extra-promise'
import { randomIntInclusive } from '@utils/random'

export interface IExponentialBackoffOptions {
  minTimeout: number
  maxTimeout?: number
  factor?: number
  jitter?: boolean
}

export function exponentialBackoff({
  minTimeout
, maxTimeout = Infinity
, factor = 2
, jitter = true
}: IExponentialBackoffOptions): IPredicate<boolean> {
  return async ({ retries }) => {
    const timeout = Math.min(factor ** retries * minTimeout, maxTimeout)
    if (jitter) {
      await delay(randomIntInclusive(0, timeout))
    } else {
      await delay(timeout)
    }
    return false
  }
}
