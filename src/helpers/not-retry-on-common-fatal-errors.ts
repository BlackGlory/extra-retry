import { notRetryOn } from './not-retry-on'
import { IPredicate } from '@src/types'

export const notRetryOnCommonFatalErrors: IPredicate<boolean> = notRetryOn([
  SyntaxError
, ReferenceError
, RangeError
, URIError
])
