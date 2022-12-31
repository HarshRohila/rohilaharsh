import { Component, h, Host } from '@stencil/core'
import { ComposeEmail } from '../../states/compose-email'

@Component({
  tag: 'compose-window',
  styleUrl: 'compose-window.scss',
  shadow: true
})
export class ComposeWindow {
  render() {
    return (
      <Host>
        <div class="container">
          <button onClick={ComposeEmail.deactivate}>X</button>
          <form onSubmit={ComposeEmail.send}>
            <textarea name="message" cols={60} rows={30}></textarea>
            <button disabled={ComposeEmail.state.isSending}>Send</button>
          </form>
        </div>
      </Host>
    )
  }
}
