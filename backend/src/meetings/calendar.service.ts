import { Injectable } from '@nestjs/common';
import { MeetingEntity } from './entities/meeting.entity';
import { UsersService } from 'src/users/users/users.service';
import { ConfigService } from '@nestjs/config';
import { ConfigTokens } from 'src/config.tokens';
import ical, { ICalCalendarMethod } from 'ical-generator';

@Injectable()
export class CalendarService {

  constructor(private configService: ConfigService) { }

  async createICAL(meeting: MeetingEntity): Promise<any> {

    var attachment;

    if (meeting.startTime && meeting.endTime) {

            var summary = 'Evendemy: ' + meeting.title;
            if(meeting.shortDescription) {
                summary += ' - ' + meeting.shortDescription;
            }

            var evendemy_event = {
                start: meeting.startTime,
                end: meeting.endTime,
                timestamp: new Date(),
                summary: summary,
                location: meeting.location
            };

            if (meeting.location) {
                evendemy_event.location = meeting.location;
            }

            attachment = {
                "filename": "ical.ics",
                "content": this.createEvent(evendemy_event)
            };
    }

    return attachment;
  }

  private createEvent(cal_event) {

		var cal = ical({
			prodId: {company: this.configService.get(ConfigTokens.CALENDAR_COMPANY), product: "Evendemy"},
			name: "Evendemy",
			method: ICalCalendarMethod.REQUEST
		});

		var event = cal.createEvent(cal_event);
        event.organizer({
            name: this.configService.get(ConfigTokens.CALENDAR_ORGANIZER_NAME),
            email: this.configService.get(ConfigTokens.CALENDAR_ORGANIZER_MAIL)
        });

		return cal.toString();
	}
}
