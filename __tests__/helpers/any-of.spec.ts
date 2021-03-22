import { anyOf } from '@helpers/any-of'
import { createContext } from './utils'
import '@blackglory/jest-matchers'

describe('anyOf(...predicates: IPredicate[]): IPredicate<boolean>', () => {
  test('mixed predicates', async () => {
    const predicate1 = jest.fn().mockResolvedValue(false)
    const predicate2 = jest.fn().mockReturnValue(false)
    const context = createContext()

    const predicate = anyOf(predicate1, predicate2)
    const result = predicate(context)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBe(false)
    expect(predicate1).toBeCalledWith(context)
    expect(predicate2).toBeCalledWith(context)
  })

  test('short-circuit evaluation', async () => {
    const predicate1 = jest.fn().mockReturnValue(true)
    const predicate2 = jest.fn().mockReturnValue(false)
    const context = createContext()

    const predicate = anyOf(predicate1, predicate2)
    const result = predicate(context)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBe(true)
    expect(predicate1).toBeCalledWith(context)
    expect(predicate2).not.toBeCalled()
  })
})
