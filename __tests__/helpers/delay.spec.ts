import { delay } from '@helpers/delay'
import { createContext, getTimestamp, TIME_ERROR } from './utils'

test('delay', async () => {
  const context = createContext()

  const predicate = delay(1000)
  const startTime = getTimestamp()
  const result = await predicate(context)
  const endTime = getTimestamp()

  expect(result).toBe(false)
  expect(endTime - startTime).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
})
