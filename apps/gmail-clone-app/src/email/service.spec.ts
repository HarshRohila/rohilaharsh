import { apiClient } from '../services/apiClient';
import { EmailService } from './service';

describe('EmailService', () => {
  describe('saveEdittedEmail', () => {
    it('makes patch request with json api serializer email', async () => {
      apiClient.patch = jest.fn();

      // @ts-ignore
      await EmailService.saveEdittedEmail({ id: '1', from: 'test' });

      expect(apiClient.patch).toBeCalledWith('mails/1', {
        data: { attributes: { from: 'test' }, id: '1', type: 'mails' },
      });
    });
  });
});
