import { Subject } from 'rxjs'

/**
 * Applied to instances and stores `Subject` instance when
 * no custom destroy method is provided.
 */
const DESTROY: unique symbol = Symbol('__destroy')

/**
 * Applied to definitions and informs that class is decorated
 */
export const DECORATOR_APPLIED: unique symbol = Symbol('__decoratorApplied')

/**
 * If we use the `untilDestroyed` operator multiple times inside the single
 * instance providing different `destroyMethodName`, then all streams will
 * subscribe to the single subject. If any method is invoked, the subject will
 * emit and all streams will be unsubscribed. We wan't to prevent this behavior,
 * thus we store subjects under different symbols.
 */
export function getSymbol<T>(destroyMethodName?: keyof T): symbol {
  if (typeof destroyMethodName === 'string') {
    return Symbol(`__destroy__${destroyMethodName}`)
  } else {
    return DESTROY
  }
}

export interface UntilDestroyOptions {
  blackList?: string[]
  arrayName?: string
  checkProperties?: boolean
}

export function createSubjectOnTheInstance(instance: any, symbol: symbol): void {
  if (!instance[symbol]) {
    instance[symbol] = new Subject<void>()
  }
}

export function completeSubjectOnTheInstance(instance: any, symbol: symbol): void {
  if (instance[symbol]) {
    instance[symbol].next()
    instance[symbol].complete()
    // We also have to re-assign this property thus in the future
    // we will be able to create new subject on the same instance.
    instance[symbol] = null
  }
}
