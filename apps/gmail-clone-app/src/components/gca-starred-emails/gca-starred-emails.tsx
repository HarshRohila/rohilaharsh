/* eslint-disable @stencil/required-jsdoc */
import { Component, Host, h, State, Listen } from '@stencil/core'
import { Email, EmailService } from '../../email/service'

@Component({
  tag: 'gca-starred-emails',
  styleUrl: 'gca-starred-emails.css',
  shadow: true
})
export class GcaStarredEmails {
  @State() starredEmails: Email[] = []

  @Listen('delete')
  handleDeleteEmail(ev: CustomEvent<Email>) {
    const emailToDelete = ev.detail
    this.starredEmails = this.starredEmails.filter(e => e.id !== emailToDelete.id)

    EmailService.deleteEmail(emailToDelete)
  }

  componentWillLoad() {
    EmailService.getStarredEmails().then(e => {
      this.starredEmails = e
    })
  }

  render() {
    return (
      <Host>
        <email-list emails={this.starredEmails}></email-list>
      </Host>
    )
  }
}
