/* eslint-disable react/jsx-no-bind */
/* eslint-disable @stencil/required-jsdoc */
import { faCircle, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Component, Host, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core'
import { href } from '@stencil/router'
import { Email, EmailService } from '../../email/service'
import { AppRoute } from '../../utils/AppRoute'
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
  @Event() delete: EventEmitter<Email>

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

  handleDelete(email: Email) {
    this.delete.emit(email)
  }

  render() {
    const { localEmail: email } = this

    const emailPath = AppRoute.getPath(`/emails/${email.id}`)

    return (
      <Host>
        <div class="email">
          <star-checkbox
            value={this.starred}
            onToggled={({ detail }) => this.onStarToggle(detail)}
          ></star-checkbox>
          <Avatar email={this.email} />
          <a {...href(emailPath)}>
            <span class="from">{email.from}</span>
            <span class="text">
              <span class="subject">{email.subject}</span> <span class="content">{email.text}</span>
            </span>
            <span class="time">{DateUtil.formatDate(email.datetime, 'H:mm a')}</span>
          </a>
          <span class="actions">
            <Icon onClick={() => this.handleDelete(email)}></Icon>
          </span>
        </div>
      </Host>
    )
  }
}

function Avatar({ email }: { email: Email }) {
  return <img class="avatar" src={email.imageUrl} alt={`${email.from}'s avatar`} />
}

function Icon({ onClick }) {
  return (
    <button class="icon" onClick={onClick}>
      <x-icon class="circle" icon={faCircle}></x-icon>
      <x-icon class="trash" icon={faTrash}></x-icon>
    </button>
  )
}
