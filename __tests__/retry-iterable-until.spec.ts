import { describe, test, expect, vi } from 'vitest'
import { retryIterableUntil } from '@src/retry-iterable-until.js'
import { getErrorAsyncIterable } from 'return-style'
import { IPredicate } from '@src/types.js'
import { Awaitable } from 'justypes'
import { go, toArrayAsync } from '@blackglory/prelude'

describe.each([
  <T>(
    predicate: IPredicate
  , fn: () => Awaitable<Iterable<T> | AsyncIterable<T>>
  ) => retryIterableUntil(predicate)(fn)
, <T>(
    predicate: IPredicate
  , fn: () => Awaitable<Iterable<T> | AsyncIterable<T>>
  ) => retryIterableUntil(predicate, fn)
])('retryIterableUntil', retryIterableUntil => {
  test('resolved', async () => {
    const error = new Error('CustomError')
    let runs = 0
    const fn = vi.fn<() => Promise<AsyncIterable<string>>>(() => {
      return Promise.resolve(go(async function* () {
        runs++

        yield Promise.resolve('foo')

        switch (runs) {
          case 1: {
            yield Promise.resolve('bar')

            throw error
          }
          case 2: {
            yield Promise.resolve('baz')
            yield Promise.reject(error)

            process.exit()
          }
          default: yield Promise.resolve('qux')
        }
      }))
    })
    const predicate = vi.fn()
      .mockReturnValue(false)

    const result = await toArrayAsync(retryIterableUntil(predicate, fn))

    expect(fn).toHaveBeenCalledTimes(3)
    expect(predicate).toHaveBeenCalledTimes(2)
    expect(predicate).nthCalledWith(1, { error, retries: 0 })
    expect(predicate).nthCalledWith(2, { error, retries: 1 })
    expect(result).toStrictEqual(['foo', 'bar', 'foo', 'baz', 'foo', 'qux'])
  })

  describe('rejected', () => {
    describe('outside iterable', () => {
      test('sync', async () => {
        const error = new Error('CustomError')
        const fn = vi.fn<() => never>()
          .mockThrow(error)
        const predicate = vi.fn<() => boolean>()
          .mockReturnValueOnce(false)
          .mockReturnValue(true)

        const err = await getErrorAsyncIterable(retryIterableUntil(predicate, fn))

        expect(fn).toHaveBeenCalledTimes(2)
        expect(predicate).toHaveBeenCalledTimes(2)
        expect(predicate).nthCalledWith(1, { error, retries: 0 })
        expect(predicate).nthCalledWith(2, { error, retries: 1 })
        expect(err).toBe(error)
      })

      test('async', async () => {
        const error = new Error('CustomError')
        const fn = vi.fn<() => never>()
          .mockRejectedValue(error)
        const predicate = vi.fn<() => boolean>()
          .mockReturnValueOnce(false)
          .mockReturnValue(true)

        const err = await getErrorAsyncIterable(retryIterableUntil(predicate, fn))

        expect(fn).toHaveBeenCalledTimes(2)
        expect(predicate).toHaveBeenCalledTimes(2)
        expect(predicate).nthCalledWith(1, { error, retries: 0 })
        expect(predicate).nthCalledWith(2, { error, retries: 1 })
        expect(err).toBe(error)
      })
    })

    describe('inside iterable', () => {
      describe('throw', () => {
        test('sync', async () => {
          const error = new Error('CustomError')
          const fn = vi.fn<() => Iterable<never>>(function* () {
            throw error
          })
          const predicate = vi.fn<() => boolean>()
            .mockReturnValueOnce(false)
            .mockReturnValue(true)

          const err = await getErrorAsyncIterable(retryIterableUntil(predicate, fn))

          expect(fn).toHaveBeenCalledTimes(2)
          expect(predicate).toHaveBeenCalledTimes(2)
          expect(predicate).nthCalledWith(1, { error, retries: 0 })
          expect(predicate).nthCalledWith(2, { error, retries: 1 })
          expect(err).toBe(error)
        })

        test('async', async () => {
          const error = new Error('CustomError')
          const fn = vi.fn<() => AsyncIterable<never>>(async function* () {
            throw error
          })
          const predicate = vi.fn<() => boolean>()
            .mockReturnValueOnce(false)
            .mockReturnValue(true)

          const err = await getErrorAsyncIterable(retryIterableUntil(predicate, fn))

          expect(fn).toHaveBeenCalledTimes(2)
          expect(predicate).toHaveBeenCalledTimes(2)
          expect(predicate).nthCalledWith(1, { error, retries: 0 })
          expect(predicate).nthCalledWith(2, { error, retries: 1 })
          expect(err).toBe(error)
        })
      })

      describe('rejected promise', () => {
        test('sync', async () => {
          const error = new Error('CustomError')
          const fn = vi.fn<() => Iterable<Promise<never>>>(function* () {
            yield Promise.reject(error)
          })
          const predicate = vi.fn<() => boolean>()
            .mockReturnValueOnce(false)
            .mockReturnValue(true)

          const err = await getErrorAsyncIterable(retryIterableUntil(predicate, fn))

          expect(fn).toHaveBeenCalledTimes(2)
          expect(predicate).toHaveBeenCalledTimes(2)
          expect(predicate).nthCalledWith(1, { error, retries: 0 })
          expect(predicate).nthCalledWith(2, { error, retries: 1 })
          expect(err).toBe(error)
        })

        test('async', async () => {
          const error = new Error('CustomError')
          const fn = vi.fn<() => AsyncIterable<never>>(async function* () {
            yield Promise.reject(error)
          })
          const predicate = vi.fn<() => boolean>()
            .mockReturnValueOnce(false)
            .mockReturnValue(true)

          const err = await getErrorAsyncIterable(retryIterableUntil(predicate, fn))

          expect(fn).toHaveBeenCalledTimes(2)
          expect(predicate).toHaveBeenCalledTimes(2)
          expect(predicate).nthCalledWith(1, { error, retries: 0 })
          expect(predicate).nthCalledWith(2, { error, retries: 1 })
          expect(err).toBe(error)
        })
      })
    })
  })
})
