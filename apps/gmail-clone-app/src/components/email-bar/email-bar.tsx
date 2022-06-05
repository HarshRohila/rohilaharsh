import { Component, Host, h, Prop, State } from '@stencil/core'
import { href } from '@stencil/router'
import { Email, EmailService } from '../../email/service'
import { DateUtil } from '../../utils/dateUtil'

@Component({
  tag: 'email-bar',
  styleUrl: 'email-bar.scss',
  shadow: true
})
export class EmailBar {
  @Prop() email: Email

  @State() starred = false

  onStarToggle(starred: boolean) {
    const email = { ...this.email }
    email.starred = starred
    EmailService.saveEdittedEmail(email)

    this.starred = starred
  }

  render() {
    const { email } = this

    return (
      <Host>
        <div class="email">
          <star-checkbox
            value={this.starred}
            onToggled={({ detail }) => this.onStarToggle(detail)}
          ></star-checkbox>
          <a {...href(`emails/${email.id}`)}>
            <span class="from">{email.from}</span>
            <span class="text">
              <span class="subject">{email.subject}</span> <span class="content">{email.text}</span>
            </span>
            <span class="time">{DateUtil.formatDate(email.datetime, 'H:mm a')}</span>
          </a>
        </div>
      </Host>
    )
  }
}
