import { retryOn } from '@helpers/retry-on.js'
import { createContext } from './utils.js'

describe('retryOn', () => {
  describe('matched', () => {
    it('return false', () => {
      const context = createContext({ error: new TypeError('custom type error') })

      const predicate = retryOn([TypeError])
      const result = predicate(context)

      expect(result).toBe(false)
    })
  })

  describe('not matched', () => {
    it('return true', () => {
      const context = createContext({ error: new TypeError('custom type error') })

      const predicate = retryOn([SyntaxError])
      const result = predicate(context)

      expect(result).toBe(true)
    })
  })
})
