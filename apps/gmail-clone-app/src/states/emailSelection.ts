import { createStore } from '@stencil/store'
import { Email } from '../email/service'

export { EmailSelection }

const { state } = createStore({
  selectedEmailIds: new Set()
})

const EmailSelection = {
  selectEmail(email: Email) {
    const selectedEmailIds = state.selectedEmailIds

    if (selectedEmailIds.has(email.id)) {
      selectedEmailIds.delete(email.id)
    } else {
      selectedEmailIds.add(email.id)
    }
    state.selectedEmailIds = new Set(selectedEmailIds)
  },
  reset() {
    state.selectedEmailIds = new Set()
  },
  state
}
