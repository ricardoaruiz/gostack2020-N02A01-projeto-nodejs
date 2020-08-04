import { subMinutes } from 'date-fns';

import IDateProvider from '../models/IDateProvider';

export default class FnsDateProvider implements IDateProvider {
  getLocaDateTime(date: Date): Date {
    const timezoneOffset = new Date().getTimezoneOffset();
    return subMinutes(date, timezoneOffset);
  }
}
