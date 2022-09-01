/* eslint-disable react/jsx-no-bind */
/* eslint-disable @stencil/required-jsdoc */
import { faCircle, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Component, Host, h, Prop, State, Watch } from '@stencil/core'
import { href } from '@stencil/router'
import { Email, EmailService } from '../../email/service'
import { DateUtil } from '../../utils/dateUtil'

@Component({
  tag: 'email-bar',
  styleUrl: 'email-bar.scss',
  shadow: true
})
export class EmailBar {
  // don't use email prop at any other place, use localEmail instead
  @Prop() email: Email
  @Watch('email')
  onEmailChange() {
    this.localEmail = this.email
  }

  @State() localEmail: Email

  get starred() {
    return this.localEmail.starred
  }

  componentWillLoad() {
    this.onEmailChange()
  }

  private onStarToggle(starred: boolean) {
    const email = { ...this.localEmail }
    email.starred = starred
    EmailService.saveEdittedEmail(email)

    this.localEmail = { ...this.localEmail, starred }
  }

  render() {
    const { localEmail: email } = this

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
          <span class="actions">
            <Icon></Icon>
          </span>
        </div>
      </Host>
    )
  }
}

function Icon() {
  return (
    <button class="icon">
      <x-icon class="circle" icon={faCircle}></x-icon>
      <x-icon class="trash" icon={faTrash}></x-icon>
    </button>
  )
}
