import { delay } from '@helpers/delay'
import { createContext, getTimestamp, TIME_ERROR } from './utils'
import '@blackglory/jest-matchers'

test('delay', async () => {
  const context = createContext()

  const predicate = delay(1000)
  const startTime = getTimestamp()
  const result = predicate(context)
  const proResult = await result
  const endTime = getTimestamp()

  expect(result).toBePromise()
  expect(proResult).toBe(false)
  expect(endTime - startTime).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
})
