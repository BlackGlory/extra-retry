import { IPredicate } from '@src/types'
import { delay } from 'extra-promise'
import { calculateExponentialBackoffTimeout } from 'extra-timers'

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
    const timeout = calculateExponentialBackoffTimeout({
      baseTimeout
    , retries
    , factor
    , jitter
    , maxTimeout
    })
    await delay(timeout)
    return false
  }
}
