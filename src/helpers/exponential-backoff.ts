import { IPredicate } from '@src/types'
import { delay } from 'extra-promise'
import { randomIntInclusive } from '@utils/random'

export interface IExponentialBackoffOptions {
  baseTimeout: number
  maxTimeout?: number
  factor?: number
  jitter?: boolean
}

export function exponentialBackoff({
  baseTimeout
, maxTimeout = Infinity
, factor = 2
, jitter = true
}: IExponentialBackoffOptions): IPredicate<boolean> {
  return async ({ retries }) => {
    const timeout = Math.min(factor ** retries * baseTimeout, maxTimeout)
    if (jitter) {
      await delay(randomIntInclusive(0, timeout))
    } else {
      await delay(timeout)
    }
    return false
  }
}
