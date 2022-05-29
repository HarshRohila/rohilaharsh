import { Component, Host, h, Prop, State, Fragment } from '@stencil/core'
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
        <div class="container">
          {this.isLoading && <h1>Loading...</h1>}
          {!this.isLoading && <Email email={this.email} />}
        </div>
      </Host>
    )
  }
}

function Email({ email }: { email: Email }) {
  const fromEmail = `<${email.fromEmail}>`

  return (
    <Fragment>
      <header>{email.subject}</header>
      <div>
        <strong>{email.from}</strong>
        <span>{fromEmail}</span>
      </div>
      <div class="me">to me</div>
    </Fragment>
  )
}
