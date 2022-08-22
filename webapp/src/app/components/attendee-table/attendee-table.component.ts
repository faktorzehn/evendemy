import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MeetingUser } from '../../model/meeting_user';
import { User } from '../../model/user';

@Component({
  selector: 'evendemy-attendee-table',
  templateUrl: './attendee-table.component.html',
  styleUrls: ['./attendee-table.component.scss']
})
export class AttendeeTableComponent {

  @Input() attendees: MeetingUser[] = [];
  @Input() users: User[] = [];
  @Input() editable = false;
  @Input() showTakePartButton = true;
  @Input() disableTakePartButton = true;
  @Output() tookPartClicked = new EventEmitter<MeetingUser>();

  constructor() { }

  getUser(username: string) {
    const res = this.users.find( user => user.username === username);
    return res ? res : username;
  }

  onClickTakeParteButton(attendee: MeetingUser) {
    this.tookPartClicked.emit(attendee);
  }
}
