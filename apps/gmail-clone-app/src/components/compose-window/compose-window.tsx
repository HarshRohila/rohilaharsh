import { untilDestroyed } from '@ngneat/until-destroy'
import { Component, h, Host, State, Element } from '@stencil/core'
import { merge, skip, Subject } from 'rxjs'
import { ComposeEmail, State as ComposeEmailState } from '../../states/compose-email'

@Component({
  tag: 'compose-window',
  styleUrl: 'compose-window.scss',
  shadow: true
})
export class ComposeWindow {
  @State() state: ComposeEmailState

  @Element() el: HTMLComposeWindowElement

  connectedCallback() {
    this.state = ComposeEmail.state$.value
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnectedCallback() {}

  componentDidLoad() {
    const stateFromSubmit$ = ComposeEmail.stateFromSubmit$(this.submit$)
    const stateFromClose$ = ComposeEmail.stateFromCloseClick(this.close$)

    const state$ = merge(ComposeEmail.state$.pipe(skip(1)), stateFromSubmit$, stateFromClose$)

    state$.pipe(untilDestroyed(this, 'disconnectedCallback')).subscribe(state => {
      this.state = { ...state }
    })
  }

  private submit$ = new Subject<Event>()
  private handleSubmit = (ev: Event) => {
    this.submit$.next(ev)
  }

  private close$ = new Subject<Event>()
  private handleClose = (ev: Event) => {
    this.close$.next(ev)
  }

  render() {
    return (
      <Host>
        <div class="container">
          <button class="close" onClick={this.handleClose}>
            X
          </button>
          <form onSubmit={this.handleSubmit}>
            <textarea name="message" cols={60} rows={30}></textarea>
            <button disabled={this.state.isSending}>Send</button>
          </form>
        </div>
      </Host>
    )
  }
}
