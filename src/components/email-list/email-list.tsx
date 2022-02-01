import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Component, Host, h, State } from '@stencil/core';
import { Email, EmailService } from '../../email/service';

@Component({
  tag: 'email-list',
  styleUrl: 'email-list.scss',
  shadow: true,
})
export class EmailList {
  @State() isLoading = true;
  @State() emails: Email[];

  componentWillLoad() {
    EmailService.getEmails()
      .then(emails => {
        this.emails = emails;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  render() {
    return (
      <Host>
        {this.isLoading && <x-icon class="spinner" icon={faSpinner} spin></x-icon>}
        {!this.isLoading && !!this.emails.length && (
          <ul>
            {this.emails.map(email => (
              <li>
                <email-bar email={email}></email-bar>
              </li>
            ))}
          </ul>
        )}
      </Host>
    );
  }
}
