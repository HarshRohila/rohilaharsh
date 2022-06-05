/* eslint-disable @stencil/required-jsdoc */
import { Component, Host, h, Prop } from '@stencil/core'
import { Email, EmailService } from '../../email/service'

@Component({
  tag: 'gca-starred-emails',
  styleUrl: 'gca-starred-emails.css',
  shadow: true
})
export class GcaStarredEmails {
  @Prop() starredEmails: Email[] = []

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
