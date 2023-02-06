import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UsersStore } from '../../core/store/user.store';
import { MeetingUser } from '../../model/meeting_user';
import { User } from '../../model/user';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'evendemy-attendee-table',
  templateUrl: './attendee-table.component.html',
  styleUrls: ['./attendee-table.component.scss']
})
export class AttendeeTableComponent extends BaseComponent{

  @Input() attendees: MeetingUser[] = [];
  @Input() editable = false;
  @Input() showTakePartButton = true;
  @Input() disableTakePartButton = true;
  @Output() tookPartClicked = new EventEmitter<MeetingUser>();
  
  users: User[] = [];
  
  constructor(usersStore: UsersStore) { 
    super();
    this.addSubscription(usersStore.users().subscribe(users=>this.users=users));
  }

  getUser(username: string) {
    const res = this.users.find( user => user.username === username);
    return res ? res : username;
  }

  onClickTakeParteButton(attendee: MeetingUser) {
    this.tookPartClicked.emit(attendee);
  }
}
