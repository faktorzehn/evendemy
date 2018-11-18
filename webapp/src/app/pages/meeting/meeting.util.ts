import * as moment from 'moment';
import { MeetingUser } from '../../model/meeting_user';
import { User } from '../../model/user';
import * as toCSV from 'array-to-csv';

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


}
