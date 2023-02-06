import { EventEmitter, Input, OnInit, Output, Directive } from '@angular/core';

import { Meeting } from '../../model/meeting';

export enum AttendeeStatus {
  NOT_ATTENDING = 'NOT_ATTENDING',
  ATTENDING = 'ATTENDING',
  CONFIRMED = 'CONFIRMED',
  INVALID = 'INVALID'
}

@Directive()
export abstract class AbstractAttendeeStatusComponent implements OnInit {

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

  onAccept(name: string) {
    this.acceptMeeting.emit(name);
  }

  onReject() {
    this.rejectMeeting.emit(true);
  }

  onCalendar() {
    this.calendar.emit(true);
  }

  isNotAttending() {
    return this.status === AttendeeStatus.NOT_ATTENDING;
  }

  isAttending() {
    return this.status === AttendeeStatus.ATTENDING;
  }

  isConfirmed() {
    return this.status === AttendeeStatus.CONFIRMED;
  }

  hasValidDate() {
    return this.meeting.startTime != null && this.meeting.endTime != null;
  }

}
