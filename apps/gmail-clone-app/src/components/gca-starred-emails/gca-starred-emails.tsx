/* eslint-disable @stencil/required-jsdoc */
import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core'
import { Email, EmailService } from '../../email/service'
import { EmailSelection } from '../../states/emailSelection'

@Component({
  tag: 'gca-starred-emails',
  styleUrl: 'gca-starred-emails.css',
  shadow: true
})
export class GcaStarredEmails {
  @Prop() starredEmails: Email[] = []

  @Event() changedStarredEmails: EventEmitter<Email[]>

  componentWillLoad() {
    EmailService.getStarredEmails().then(e => {
      this.changedStarredEmails.emit(e)
    })
  }

  disconnectedCallback() {
    EmailSelection.reset()
  }

  render() {
    return (
      <Host>
        <email-list emails={this.starredEmails}></email-list>
      </Host>
    )
  }
}
