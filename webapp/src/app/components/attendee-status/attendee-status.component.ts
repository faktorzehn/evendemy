import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Meeting } from '../../model/meeting';

export enum AttendeeStatus {
  NOT_ATTENDING = 'NOT_ATTENDING',
  ATTENDING = 'ATTENDING',
  CONFIRMED = 'CONFIRMED',
  INVALID = 'INVALID'
}

@Component({
  selector: 'evendemy-attendee-status',
  templateUrl: './attendee-status.component.html',
  styleUrls: ['./attendee-status.component.scss']
})
export class AttendeeStatusComponent implements OnInit {

  @Input()
  meeting: Meeting;

  @Input()
  status: AttendeeStatus;

  @Output()
  acceptMeeting = new EventEmitter<string>();

  @Output()
  rejectMeeting = new EventEmitter<boolean>();

  @Output()
  calendar = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  protected onAccept(name: string) {
    this.acceptMeeting.emit(name);
  }

  protected onReject() {
    this.rejectMeeting.emit(true);
  }

  protected onCalendar() {
    this.calendar.emit(true);
  }

  protected isNotAttending() {
    return this.status === AttendeeStatus.NOT_ATTENDING;
  }

  protected isAttending() {
    return this.status === AttendeeStatus.ATTENDING;
  }

  protected isConfirmed() {
    return this.status === AttendeeStatus.CONFIRMED;
  }

  protected hasValidDate() {
    return this.meeting.startTime && this.meeting.endTime && this.meeting.date;
  }

}
