import { Component, Host, h, Prop } from '@stencil/core'
import { href } from '@stencil/router'
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
                <a {...href(`emails/${email.id}`)}>
                  <email-bar email={email}></email-bar>
                </a>
              </li>
            ))}
          </ul>
        )}
      </Host>
    )
  }
}
