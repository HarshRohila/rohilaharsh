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
  closeWindow$(close$: Observable<Event>) {
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
  openComposeWindow$(composeClick$: Observable<Event>) {
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
  sendEmail$(emailForm$: Observable<EmailForm>) {
    return emailForm$.pipe(
      switchMap(emailForm =>
        defer(() => EmailService.sendEmail(emailForm)).pipe(startWith('loading'))
      ),
      map(v => {
        if (v === 'loading') {
          state.isSending = true
          return state
        }

        state.isSending = false
        state.isActive = false
        return state
      }),
      tap(state => {
        state$.next(state)
      })
    )
  }
}

interface State {
  isActive: boolean
  isSending: boolean
}

export interface EmailForm {
  message: string
}
