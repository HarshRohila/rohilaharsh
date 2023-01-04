import { untilDestroyed } from '@ngneat/until-destroy'
import { Component, h, Host, State, Element } from '@stencil/core'
import { BehaviorSubject, Subject, switchMap, tap } from 'rxjs'
import { ComposeEmail, EmailForm, State as ComposeEmailState } from '../../states/compose-email'

@Component({
  tag: 'compose-window',
  styleUrl: 'compose-window.scss',
  shadow: true
})
export class ComposeWindow {
  @State() state: ComposeEmailState

  @Element() el: HTMLComposeWindowElement

  connectedCallback() {
    ComposeEmail.state$.pipe(untilDestroyed(this, 'disconnectedCallback')).subscribe(state => {
      this.state = { ...state }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnectedCallback() {}

  componentDidLoad() {
    ComposeEmail.sendEmail$(
      this.submit$.pipe(
        tap(ev => ev.preventDefault()),
        switchMap(() => this.emailForm$)
      )
    )
      .pipe(untilDestroyed(this, 'disconnectedCallback'))
      .subscribe()

    ComposeEmail.closeWindow$(this.close$)
      .pipe(untilDestroyed(this, 'disconnectedCallback'))
      .subscribe()
  }

  private submit$ = new Subject<Event>()
  private handleSubmit = (ev: Event) => {
    this.submit$.next(ev)
  }

  private close$ = new Subject<Event>()
  private handleClose = (ev: Event) => {
    this.close$.next(ev)
  }

  private emailForm$ = new BehaviorSubject<EmailForm>({ message: '' })
  private handleMessageChange = (ev: Event) => {
    const textArea = ev.target as HTMLTextAreaElement
    this.emailForm$.next({
      message: textArea.value
    })
  }

  render() {
    return (
      <Host>
        <div class="container">
          <button class="close" onClick={this.handleClose}>
            X
          </button>
          <form onSubmit={this.handleSubmit}>
            <textarea
              name="message"
              onInput={this.handleMessageChange}
              cols={60}
              rows={30}
            ></textarea>
            <button disabled={this.state.isSending}>Send</button>
          </form>
        </div>
      </Host>
    )
  }
}
