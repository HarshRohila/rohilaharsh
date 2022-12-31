import { createStore } from '@stencil/store'
import { defer, of, switchMap, tap } from 'rxjs'
import { EmailService } from '../email/service'
export { ComposeEmail }

const { state } = createStore({
  isActive: false,
  isSending: false
})

const ComposeEmail = {
  state,
  activate() {
    state.isActive = true
  },
  deactivate() {
    state.isActive = false
  },
  send(ev: Event) {
    return of(ev).pipe(
      tap(ev => ev.preventDefault()),
      switchMap(() => defer(() => EmailService.sendEmail())),
      tap(() => {
        state.isSending = false
      })
    )
  }
}
