import { describe, it, expect, vi } from 'vitest'
import { tap } from '@helpers/tap.js'
import { createContext } from './utils.js'

describe('tap', () => {
  it('always returns false', () => {
    const context = createContext()
    const fn = vi.fn()

    const predicate = tap(fn)
    const result = predicate(context)

    expect(result).toBe(false)
    expect(fn).toBeCalledTimes(1)
    expect(fn).toBeCalledWith(context)
  })
})
