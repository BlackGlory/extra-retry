import { exponentialBackoff } from '@helpers/exponential-backoff'
import { createContext, getTimestamp, TIME_ERROR } from './utils'

describe('exponentialBackoff', () => {
  test('maxTimeout', async () => {
    const context = createContext({ retries: 2 })

    // Math.min(2 ** 2 * 500, 1500) = 1500
    const predicate = exponentialBackoff({
      baseTimeout: 500
    , maxTimeout: 1500
    , factor: 2
    , jitter: false
    })
    const startTime = getTimestamp()
    const result = await predicate(context)
    const endTime = getTimestamp()

    expect(result).toBe(false)
    expect(endTime - startTime).toBeGreaterThanOrEqual(1500 - TIME_ERROR)
    expect(endTime - startTime).toBeLessThan(2000 - TIME_ERROR)
  })

  describe('jitter', () => {
    test('jitter = true', async () => {
      const context = createContext({ retries: 2 })

      // Math.min(2 ** 2 * 500, Infinity) = 2000
      const predicate = exponentialBackoff({
        baseTimeout: 500
      , maxTimeout: Infinity
      , factor: 2
      , jitter: true
      })
      const startTime = getTimestamp()
      const result = await predicate(context)
      const endTime = getTimestamp()

      expect(result).toBe(false)
      expect(endTime - startTime).toBeLessThanOrEqual(2000)
    })

    test('jitter = false', async () => {
      const context = createContext({ retries: 2 })

      // Math.min(2 ** 2 * 500, Infinity) = 2000
      const predicate = exponentialBackoff({
        baseTimeout: 500
      , maxTimeout: Infinity
      , factor: 2
      , jitter: false
      })
      const startTime = getTimestamp()
      const result = await predicate(context)
      const endTime = getTimestamp()

      expect(result).toBe(false)
      expect(endTime - startTime).toBeGreaterThanOrEqual(2000 - TIME_ERROR)
    })
  })
})
