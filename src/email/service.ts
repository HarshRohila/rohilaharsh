import { apiClient } from '../services/apiClient';

export { EmailService, Email };

const EmailService = {
  async getEmails(): Promise<Email[]> {
    const response = await apiClient.get('mails');
    return response.data.mails.map((mail: { datetime: string | number | Date }) => {
      mail.datetime = new Date(mail.datetime);
      return mail;
    });
  },
};

interface Email {
  from: string;
  subject: string;
  text: string;
  datetime: Date;
}
