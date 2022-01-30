import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Component, Host, h, State } from '@stencil/core';
import { Email, EmailService } from '../../email/service';
import { DateUtil } from '../../utils/dateUtil';

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
                <Email email={email}></Email>
              </li>
            ))}
          </ul>
        )}
      </Host>
    );
  }
}

function Email({ email }: { email: Email }) {
  return (
    <div class="email">
      <span class="from">{email.from}</span>
      <span class="text">
        <span class="sub">{email.subject}</span> <span class="content">{email.text}</span>
      </span>
      <span class="time">{DateUtil.formatDate(email.datetime, 'H:mm a')}</span>
    </div>
  );
}
