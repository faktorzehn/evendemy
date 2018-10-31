import { Component, OnInit, Input } from '@angular/core';
import { Meeting } from '../../model/meeting';
import { ConfigService } from '@ngx-config/core';
import * as moment from 'moment';
import { MeetingUser } from '../../model/meeting_user';

@Component({
  selector: 'evendemy-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss']
})
export class MeetingListComponent implements OnInit {

  @Input()
  public meetings: Meeting[] = [];

  @Input()
  public attendedMeetingInformation: MeetingUser[] = [];

  private randomizedNumber = Math.floor(Math.random() * 10000);
  private imageFolder = this.config.getSettings().meeting_image_folder;

  constructor(private config: ConfigService) {
  }

  ngOnInit() {
  }

  getImage(mid: number) {
    if (!this.imageFolder) {
      return;
    }
    return this.imageFolder + '/' + mid + '.jpg' + '?r=' + this.randomizedNumber;
  }

  isMeetingNew(meeting: Meeting): boolean {
    const now = moment();
    return moment(meeting.creationDate).isSame(now, 'day');
  }

  isAttending(meeting: Meeting): boolean {
    if (!meeting) {
      return false;
    }

    const attendingInformation = this.attendedMeetingInformation.find( mu => mu.mid === meeting.mid);

    return attendingInformation ? ! attendingInformation.tookPart : false;
  }

  hasTookPart(meeting: Meeting): boolean {
    if (!meeting) {
      return false;
    }

    const attendingInformation = this.attendedMeetingInformation.find( mu => mu.mid === meeting.mid);

    return attendingInformation ? attendingInformation.tookPart : false;
  }


}
