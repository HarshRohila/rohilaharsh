import { Component, h } from '@stencil/core'

@Component({
  tag: 'sent-emails',
  styleUrl: 'sent-emails.scss',
  shadow: true
})
export class SentEmails {
  render() {
    return <email-list emails={[]}></email-list>
  }
}
