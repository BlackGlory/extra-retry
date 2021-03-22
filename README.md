# extra-retry
Yet another retry library, but functional style.

## Install

```sh
npm install --save extra-retry
# or
yarn add extra-retry
```

## Usage

```ts
import { anyOf, maxRetries, delay } from 'extra-retry'
import ms from 'ms'

await retryUntil(fn, anyOf(
  maxRetries(3)
, delay(ms('5s'))
))
```

## API

```ts
interface IContext {
  error: Error
  retries: number // the number of retries, starting from 0.
}

type IPredicate<T = unknown> = (context: IContext) => T | PromiseLike<T>
```

## retryUntil

```ts
function retryUntil<T>(predicate: IPredicate): (fn: () => T | PromiseLike<T>) => Promise<T>
function retryUntil<T>(predicate: IPredicate, fn: () => T | PromiseLike<T>): Promise<T>
```

If `fn` throws an error,
retry until the return value of the `predicate` is [Truthy].

[Truthy]: https://developer.mozilla.org/en-US/docs/Glossary/Truthy

### Helpers

#### anyOf

```ts
function anyOf(...predicates: IPredicate[]): IPredicate<boolean>
```

Equivalent to
```ts
context => await predicate1(context)
        || await predicate2(context)
        || ...
        || await predicateN(context)
```

#### delay

```ts
function delay(ms: number): IPredicate
```

#### exponentialBackoff

```ts
function exponentialBackoff({
  minTimeout
, maxTimeout = Infinity
, factor = 2
, jitter = true
}: {
  minTimeout: number
  maxTimeout?: number
  factor?: number
  jitter?: boolean
}): IPredicate<boolean>
```

Equivalent to
```ts
const timeout = Math.min(factor ** retries * minTimeout, maxTimeout)
delay(jitter ? randomIntInclusive(0, timeout) : timeout)
```

#### maxRetries

```ts
function maxRetries(times: number): IPredicate<boolean>
```

#### notRetryOn

```ts
function notRetryOn(errors: Array<Constructor<Error>>): IPredicate<boolean>
```

Blacklist.

#### notRetryOnCommonFatalErrors

```ts
const notRetryOnCommonFatalErrors: IPredicate<boolean>
```

This predicate blacklists theses errors:
- `SyntaxError`
- `ReferenceError`
- `RangeError`
- `URIError`

There is no `TypeError` because `TypeError` does not mean
"a value is not of the expected type",
it has been abused for various purposes.

#### retryOn

```ts
function retryOn(errors: Array<Constructor<Error>>): IPredicate<boolean>
```

Whitelist.

#### signal

```ts
function signal(abortSignal: AbortSignal): IPredicate<boolean>
```
