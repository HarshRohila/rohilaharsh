import { Component, Host, h, Prop, State } from '@stencil/core'
import { Email, EmailService } from '../../email/service'

@Component({
  tag: 'gca-email-page',
  styleUrl: 'email-page.scss',
  shadow: true
})
export class EmailPage {
  @Prop() emailId: string

  @State() isLoading = true
  @State() email: Email

  componentWillLoad() {
    EmailService.getEmail(this.emailId)
      .then(email => {
        this.email = email
      })
      .finally(() => {
        this.isLoading = false
      })
  }

  render() {
    return (
      <Host>
        <div>
          {this.isLoading && <h1>Loading...</h1>}
          {!this.isLoading && this.email.subject}
        </div>
      </Host>
    )
  }
}
