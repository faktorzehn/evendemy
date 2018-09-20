import { Component, OnInit, Input } from '@angular/core';
import { Meeting } from '../../model/meeting';
import { ConfigService } from '@ngx-config/core';
import * as moment from 'moment';

@Component({
  selector: 'evendemy-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss']
})
export class MeetingListComponent implements OnInit {

  @Input()
  public meetings: Meeting[] = [];

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

  isMeetingNew(meeting: Meeting) {
    const now = moment();
    return moment(meeting.creationDate).isSame(now, 'day');
  }

}
