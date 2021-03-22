import { notRetryOn } from '@helpers/not-retry-on'
import { createContext } from './utils'

describe('notRetryOn(errors: Array<Constructor<Error>>): IPredicate<boolean>', () => {
  describe('matched', () => {
    it('return true', () => {
      const context = createContext({ error: new TypeError('custom type error') })

      const predicate = notRetryOn([TypeError])
      const result = predicate(context)

      expect(result).toBe(true)
    })
  })

  describe('not matched', () => {
    it('return false', () => {
      const context = createContext({ error: new TypeError('custom type error') })

      const predicate = notRetryOn([SyntaxError])
      const result = predicate(context)

      expect(result).toBe(false)
    })
  })
})
