import { EmailService } from '../../email/service';
import { EmailBar } from './email-bar';

describe('email-bar', () => {
  it('makes edit request when email is starred', () => {
    EmailService.saveEdittedEmail = jest.fn();

    const emailBar = new EmailBar();
    // @ts-ignore
    emailBar.email = { subject: 'email' };
    emailBar.onStarToggle(true);

    expect(EmailService.saveEdittedEmail).toBeCalledWith({ starred: true, subject: 'email' });
  });
});
