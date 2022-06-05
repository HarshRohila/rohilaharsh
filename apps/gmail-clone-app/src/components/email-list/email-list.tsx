import { Component, Host, h, Prop } from '@stencil/core'
import { Email } from '../../email/service'
@Component({
  tag: 'email-list',
  styleUrl: 'email-list.scss',
  shadow: true
})
export class EmailList {
  @Prop() emails: Email[]

  render() {
    return (
      <Host>
        {!!this.emails.length && (
          <ul>
            {this.emails.map(email => (
              <li>
                <email-bar email={email}></email-bar>
              </li>
            ))}
          </ul>
        )}
      </Host>
    )
  }
}
