import { apiClient } from '../services/apiClient';
import { JsonApi } from '../utils/jsonapi';

export { EmailService, Email };

const EmailService = {
  async getEmails(): Promise<Email[]> {
    const response = await apiClient.get('mails');
    return response.data.mails.map((mail: { datetime: string | number | Date }) => {
      mail.datetime = new Date(mail.datetime);
      return mail;
    });
  },

  async saveEdittedEmail(email: Email) {
    const MailSerializer = JsonApi.newSerializer('mail', {
      attributes: ['from', 'subject', 'text', 'datetime', 'starred'],
    });

    const serializedEmail = MailSerializer.serialize(email);
    await apiClient.patch(`mails/${email.id}`, serializedEmail);
  },
};

interface Email {
  id: string;
  from: string;
  subject: string;
  text: string;
  datetime: Date;
  starred: boolean;
}
