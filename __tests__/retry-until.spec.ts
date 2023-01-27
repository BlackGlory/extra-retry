import { retryUntil } from '@src/retry-until.js'
import { getErrorPromise } from 'return-style'
import { jest } from '@jest/globals'

describe('retryUntil', () => {
  describe('fn fail once', () => {
    it('return resolved Promise', async () => {
      const value = 'value'
      const error = new Error('CustomError')
      const fn = jest.fn<any>().mockRejectedValueOnce(error).mockResolvedValue(value)
      const predicate = jest.fn().mockReturnValue(false)

      const result = await retryUntil(predicate, fn)

      expect(fn).toBeCalledTimes(2)
      expect(predicate).toBeCalledTimes(1)
      expect(predicate).toBeCalledWith({ error, retries: 0 })
      expect(result).toBe(value)
    })
  })

  describe('fn retry once', () => {
    it('return rejected Promise', async () => {
      const error = new Error('CustomError')
      const fn = jest.fn<any>().mockRejectedValue(error)
      const predicate = jest.fn<any>()
        .mockResolvedValueOnce(false)
        .mockResolvedValue(true)

      const err = await await getErrorPromise(retryUntil(predicate, fn))

      expect(fn).toBeCalledTimes(2)
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, { error, retries: 0 })
      expect(predicate).nthCalledWith(2, { error, retries: 1 })
      expect(err).toBe(error)
    })
  })
})
