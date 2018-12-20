import * as moment from 'moment';
import { MeetingUser } from '../../model/meeting_user';
import { User } from '../../model/user';
import * as toCSV from 'array-to-csv';
import { AttendeeStatus } from '../../components/attendee-status/attendee-status.component';
import { Meeting } from '../../model/meeting';

export class MeetingUtil {

  private static dateFormat = 'DD.MM.YYYY';

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

  public static mapType(type: string): string {
    if (type === 'course' || type === 'event') {
      return type;
    }
    return 'event';
  }

  public static mapStatus(isNew: boolean, userHasAccepted: boolean, userHasFinished: boolean): AttendeeStatus {
      if (isNew === true) {
        return AttendeeStatus.INVALID;
      }

      if (userHasFinished) {
        return AttendeeStatus.CONFIRMED;
      } else if (userHasAccepted) {
          return AttendeeStatus.ATTENDING;
      }

      return AttendeeStatus.NOT_ATTENDING;
  }

  public static generateCSV(attendees: MeetingUser[], users: User[]): any {
    const headerCSV = [['Firstname', 'Lastname', 'email', 'has taken part']];

    const bodyCSV = attendees.map(a => {
      const user = users.find( u => u.username === a.username);
      if (user) {
        return [user.firstname, user.lastname, user.email, a.tookPart.toString()];
      }
    });

    return toCSV(headerCSV.concat(bodyCSV));
  }

  public static hasValidDateAndTime(meeting: Meeting): boolean {
    return meeting && meeting.startTime && meeting.endTime && meeting.date != null;
  }

  public static hasValidDate(meeting: Meeting): boolean {
    return meeting && meeting.date != null;
  }

  public static isInThePast(meeting: Meeting): boolean {
    if (!MeetingUtil.hasValidDate(meeting)) {
      return false;
    }
    const now = moment();
    return moment(meeting.date).isBefore(now, 'day');
  }

  public static isInThePastOrToday(meeting: Meeting): boolean {
    if (!MeetingUtil.hasValidDate(meeting)) {
      return false;
    }
    const now = moment();
    return moment(meeting.date).isSameOrBefore(now, 'day');
  }

}
