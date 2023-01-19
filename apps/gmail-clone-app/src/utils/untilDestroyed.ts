import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { getSymbol, createSubjectOnTheInstance, completeSubjectOnTheInstance } from './internals'

export default function tillDestroyed(context: unknown) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return untilDestroyed(context, 'disconnectedCallback')
}

function overrideNonDirectiveInstanceMethod(
  instance: any,
  destroyMethodName: string,
  symbol: symbol
): void {
  const originalDestroy = instance[destroyMethodName]

  createSubjectOnTheInstance(instance, symbol)

  instance[destroyMethodName] = function () {
    // eslint-disable-next-line prefer-rest-params
    originalDestroy.apply(this, arguments)
    completeSubjectOnTheInstance(this, symbol)
    // We have to re-assign this property back to the original value.
    // If the `untilDestroyed` operator is called for the same instance
    // multiple times, then we will be able to get the original
    // method again and not the patched one.
    instance[destroyMethodName] = originalDestroy
  }
}

export function untilDestroyed<T>(instance: T, destroyMethodName?: keyof T) {
  return <U>(source: Observable<U>) => {
    const symbol = getSymbol<T>(destroyMethodName)

    // If `destroyMethodName` is passed then the developer applies
    // this operator to something non-related to Angular DI system
    if (typeof destroyMethodName === 'string') {
      overrideNonDirectiveInstanceMethod(instance, destroyMethodName, symbol)
    } else {
      createSubjectOnTheInstance(instance, symbol)
    }

    const destroy$: Subject<void> = (instance as any)[symbol]

    return source.pipe(takeUntil<U>(destroy$))
  }
}
