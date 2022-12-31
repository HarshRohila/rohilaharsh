import { Component, h, Host, State, Element } from '@stencil/core'
import { BehaviorSubject, fromEvent, merge, Observable, skip, Subscription, switchMap } from 'rxjs'
import { ComposeEmail, State as ComposeEmailState } from '../../states/compose-email'

@Component({
  tag: 'compose-window',
  styleUrl: 'compose-window.scss',
  shadow: true
})
export class ComposeWindow {
  private subscription: Subscription

  @State() state: ComposeEmailState

  @Element() el: HTMLComposeWindowElement

  private afterLoadState$: Observable<ComposeEmailState>

  private isLoaded$ = new BehaviorSubject<boolean>(false)

  connectedCallback() {
    this.subscription = this.isLoaded$
      .pipe(
        switchMap(isLoaded => {
          if (isLoaded) {
            return this.afterLoadState$
          }
          return ComposeEmail.state$
        })
      )
      .subscribe(state => {
        this.state = { ...state }
      })
  }

  disconnectedCallback() {
    this.subscription.unsubscribe()
  }

  componentDidLoad() {
    // user actions
    const submit$ = this.getSubmit$()
    const close$ = this.getClose$()

    this.afterLoadState$ = merge(ComposeEmail.state$, submit$, close$).pipe(skip(1))
    this.isLoaded$.next(true)
  }

  private getSubmit$() {
    const formElement = this.el.shadowRoot.querySelector('form')
    const submit$ = fromEvent(formElement, 'submit')
    const send$ = ComposeEmail.stateFromSubmit$(submit$)
    return send$
  }

  private getClose$() {
    const closeBtn = this.el.shadowRoot.querySelector('.close')
    const close$ = fromEvent(closeBtn, 'click')
    return ComposeEmail.stateFromCloseClick(close$)
  }

  render() {
    return (
      <Host>
        <div class="container">
          <button class="close">X</button>
          <form>
            <textarea name="message" cols={60} rows={30}></textarea>
            <button disabled={this.state.isSending}>Send</button>
          </form>
        </div>
      </Host>
    )
  }
}
