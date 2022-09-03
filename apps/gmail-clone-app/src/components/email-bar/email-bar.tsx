/* eslint-disable react/jsx-no-bind */
/* eslint-disable @stencil/required-jsdoc */
import { faCheck, faCircle, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Component, Host, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core'
import { href } from '@stencil/router'
import { Email, EmailService } from '../../email/service'
import { EmailSelection } from '../../states/emailSelection'
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
  @State() selected = false
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

  handleEnterSelectionMode() {
    this.selected = !this.selected
    EmailSelection.selectEmail(this.email)
  }

  handleRightClick(ev: Event) {
    ev.preventDefault()
    this.handleEnterSelectionMode()
  }

  render() {
    const { localEmail: email } = this

    const emailPath = AppRoute.getPath(`/emails/${email.id}`)

    const classes = {
      email: true,
      selected: this.selected
    }

    return (
      <Host>
        <div class={classList(classes)}>
          <star-checkbox
            value={this.starred}
            onToggled={({ detail }) => this.onStarToggle(detail)}
          ></star-checkbox>
          <Avatar
            email={this.email}
            onClick={this.handleEnterSelectionMode.bind(this)}
            selected={this.selected}
          />
          <a {...href(emailPath)} onContextMenu={this.handleRightClick.bind(this)}>
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

function Avatar({
  email,
  onClick,
  selected
}: {
  email: Email
  onClick: (email: Email) => void
  selected: boolean
}) {
  const avatar = (
    <img
      onClick={() => onClick(email)}
      class="avatar"
      src={email.imageUrl}
      alt={`${email.from}'s avatar`}
    />
  )

  const clickedButton = (
    <button class="clicked-button" onClick={() => onClick(email)}>
      <x-icon icon={faCheck}></x-icon>
    </button>
  )
  return selected ? clickedButton : avatar
}

function Icon({ onClick }) {
  return (
    <button class="icon" onClick={onClick}>
      <x-icon class="circle" icon={faCircle}></x-icon>
      <x-icon class="trash" icon={faTrash}></x-icon>
    </button>
  )
}

function classList(classes: Record<string, boolean>) {
  return Object.keys(classes)
    .filter(c => classes[c])
    .reduce((acc, c) => {
      acc += ' ' + c
      return acc
    })
}
