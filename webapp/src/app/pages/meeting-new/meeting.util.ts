import * as moment from 'moment';
import { MeetingUser } from '../../model/meeting_user';
import { User } from '../../model/user';
import * as toCSV from 'array-to-csv';
import { AttendeeStatus } from '../../components/attendee-status/attendee-status.component';
import { Meeting } from '../../model/meeting';

export class MeetingUtil {

  private static dateFormat = 'DD.MM.YYYY';
  private static timeFormat = 'hh:mm';

  public static dateToString(date: Date): string {
    if (date) {
      return moment(date).format(MeetingUtil.dateFormat);
    }
    return '';
  }

  public static stringToDate(text: string): Date {
    if (text) {
      return moment(text, this.dateFormat).toDate();
    }
    return null;
  }

  public static dateToTimeString(date: Date): string {
    if (date) {
      return moment(date).format(MeetingUtil.timeFormat);
    }
    return '';
  }

  public static mapType(type: string): string {
    if (type === 'course' || type === 'event') {
      return type;
    }
    return 'event';
  }

  public static mapStatus(isNew: boolean, userHasAccepted: boolean, userHasFinished: boolean): 'INVALID' | 'CONFIRMED' | 'ATTENDING' | 'NOT_ATTENDING' {
      if (isNew === true) {
        return 'INVALID';
      }

      if (userHasFinished) {
        return 'CONFIRMED';
      } else if (userHasAccepted) {
          return 'ATTENDING';
      }

      return 'NOT_ATTENDING';
  }

  public static generateCSV(attendees: any[]): any {
    const headerCSV = [['Firstname', 'Lastname', 'has taken part']];

    const bodyCSV = attendees.map(a => {
      return [a.firstname, a.lastname, a.tookPart.toString()];
    });

    return toCSV(headerCSV.concat(bodyCSV));
  }

  public static hasValidDateAndTime(meeting: Meeting): boolean {
    return meeting && meeting.startTime != null && meeting.endTime != null;
  }

  public static isInThePast(meeting: Meeting): boolean {
    if (!MeetingUtil.hasValidDateAndTime(meeting)) {
      return false;
    }
    const now = moment();
    return moment(meeting.endTime).isBefore(now, 'day');
  }

  public static isInThePastOrToday(meeting: Meeting): boolean {
    if (!MeetingUtil.hasValidDateAndTime(meeting)) {
      return false;
    }
    const now = moment();
    return moment(meeting.endTime).isSameOrBefore(now, 'day');
  }

}
