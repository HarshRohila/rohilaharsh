import { DateUtil } from './dateUtil';

describe('DateUtil', () => {
  describe('formatDate', () => {
    it('formats date', () => {
      const aDate = new Date(2012, 0, 5, 10, 50, 3, 100);
      const formattedDate = DateUtil.formatDate(aDate, 'H:mm a');

      expect(formattedDate).toBe('10:50 AM');
    });
  });
});
