import { DateTime } from 'luxon';

export { DateUtil };

const DateUtil = {
  formatDate(date: Date, format: string) {
    return DateTime.fromJSDate(date).toFormat(format);
  },
};
