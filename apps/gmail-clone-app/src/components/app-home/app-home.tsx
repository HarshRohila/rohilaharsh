import { Component, h, Prop } from '@stencil/core'
import { Email } from '../../email/service'

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss',
  shadow: true
})
export class AppHome {
  @Prop() emails: Email[]

  render() {
    return (
      <div class="app-home">
        <email-list emails={this.emails}></email-list>
      </div>
    )
  }
}
