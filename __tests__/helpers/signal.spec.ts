import { signal } from '@helpers/signal.js'
import { createContext } from './utils.js'
import { AbortController } from 'extra-abort'

describe('signal', () => {
  describe('signal is not aborted', () => {
    it('return false', () => {
      const context = createContext()
      const controller = new AbortController()

      const predicate = signal(controller.signal)
      const result = predicate(context)

      expect(result).toBe(false)
    })
  })

  describe('signal is aborted', () => {
    it('return true', () => {
      const context = createContext()
      const controller = new AbortController()
      controller.abort()

      const predicate = signal(controller.signal)
      const result = predicate(context)

      expect(result).toBe(true)
    })
  })
})
