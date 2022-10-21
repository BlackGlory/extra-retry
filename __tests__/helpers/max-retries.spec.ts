import { maxRetries } from '@helpers/max-retries'
import { createContext } from './utils'

describe('maxRetries', () => {
  describe('retries < times', () => {
    it('return false', () => {
      const context = createContext({ retries: 1 })

      const predicate = maxRetries(2)
      const result = predicate(context)

      expect(result).toBe(false)
    })
  })

  describe('retires = times', () => {
    it('return true', () => {
      const context = createContext({ retries: 2 })

      const predicate = maxRetries(2)
      const result = predicate(context)

      expect(result).toBe(true)
    })
  })
})
