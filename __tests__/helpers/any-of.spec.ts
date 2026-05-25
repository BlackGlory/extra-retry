import { describe, test, expect, vi } from 'vitest'
import { anyOf } from '@helpers/any-of.js'
import { createContext } from './utils.js'

describe('anyOf', () => {
  test('mixed predicates', async () => {
    const predicate1 = vi.fn().mockResolvedValue(false)
    const predicate2 = vi.fn().mockReturnValue(false)
    const context = createContext()

    const predicate = anyOf(predicate1, predicate2)
    const result = await predicate(context)

    expect(result).toBe(false)
    expect(predicate1).toHaveBeenCalledWith(context)
    expect(predicate2).toHaveBeenCalledWith(context)
  })

  test('short-circuit evaluation', async () => {
    const predicate1 = vi.fn().mockReturnValue(true)
    const predicate2 = vi.fn().mockReturnValue(false)
    const context = createContext()

    const predicate = anyOf(predicate1, predicate2)
    const result = await predicate(context)

    expect(result).toBe(true)
    expect(predicate1).toHaveBeenCalledWith(context)
    expect(predicate2).not.toHaveBeenCalled()
  })
})
