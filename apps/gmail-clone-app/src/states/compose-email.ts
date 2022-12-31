import { BehaviorSubject, defer, map, Observable, startWith, switchMap, tap } from 'rxjs'
import { EmailService } from '../email/service'
export { ComposeEmail, State }

const state = {
  isActive: false,
  isSending: false
}

const state$ = new BehaviorSubject<State>(state)

const ComposeEmail = {
  state$,
  stateFromCloseClick(close$: Observable<Event>) {
    return close$.pipe(
      map(() => {
        state.isActive = false
        return state
      }),
      tap(state => {
        state$.next(state)
      })
    )
  },
  stateFromComposeClick(composeClick$: Observable<Event>) {
    return composeClick$.pipe(
      map(() => {
        state.isActive = true
        return state
      }),
      tap(state => {
        state$.next(state)
      })
    )
  },
  stateFromSubmit$(ev$: Observable<Event>) {
    return ev$.pipe(
      tap(ev => ev.preventDefault()),
      switchMap(() => defer(() => EmailService.sendEmail()).pipe(startWith('loading'))),
      map(v => {
        if (v === 'loading') {
          state.isSending = true
          return state
        }

        state.isSending = false
        return state
      })
    )
  }
}

interface State {
  isActive: boolean
  isSending: boolean
}
