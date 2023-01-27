import { notRetryOn } from './not-retry-on.js'
import { IPredicate } from '@src/types.js'

export const notRetryOnCommonFatalErrors: IPredicate<boolean> = notRetryOn([
  SyntaxError
, ReferenceError
, RangeError
, URIError
])
