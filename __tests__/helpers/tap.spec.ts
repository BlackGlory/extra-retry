import { tap } from '@helpers/tap'
import { createContext } from './utils'

describe('tap', () => {
  it('alwasy returns false', () => {
    const context = createContext()
    const fn = jest.fn()

    const predicate = tap(fn)
    const result = predicate(context)

    expect(result).toBe(false)
    expect(fn).toBeCalledTimes(1)
    expect(fn).toBeCalledWith(context)
  })
})
