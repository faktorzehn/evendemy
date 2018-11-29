import { Component } from '@angular/core';
import { AbstractAttendeeStatusComponent } from '../attendee-status.component';

@Component({
  selector: 'evendemy-meeting-attendee-status',
  templateUrl: './meeting-attendee-status.component.html',
  styleUrls: ['./meeting-attendee-status.component.scss']
})
export class MeetingAttendeeStatusComponent extends AbstractAttendeeStatusComponent {

}
