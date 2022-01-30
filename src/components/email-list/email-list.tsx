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
        {!this.isLoading && !!this.emails.length && this.emails.map(email => <Email email={email}></Email>)}
      </Host>
    );
  }
}

function Email({ email }: { email: Email }) {
  return (
    <div class="email">
      <span class="from">{email.from}</span>
      <span class="text">{email.subject + ' ' + email.text}</span>
      <span class="time">{email.datetime.toLocaleTimeString()}</span>
    </div>
  );
}
