import { Component, Input } from '@angular/core';
import moment from 'moment';
import { Meeting } from '../../model/meeting';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'evendemy-meeting-card',
  templateUrl: './meeting-card.component.html',
  styleUrls: ['./meeting-card.component.scss']
})
export class MeetingCardComponent {

  @Input() meeting: Meeting;
  private imageFolder = this.configService.config.meeting_image_folder;


  constructor(private configService: ConfigService<any>) { }

  getImage() {
    if (!this.imageFolder || !this.meeting?.images || this.meeting?.images.length === 0) {
      return 'assets/no-image.png';
    }
    return this.imageFolder + '/' + this.meeting?.images[0] + '.jpg';
  }

  isMeetingNew(meeting: Meeting): boolean {
    const now = moment();
    return moment(meeting.creationDate).isSame(now, 'day');
  }
}
