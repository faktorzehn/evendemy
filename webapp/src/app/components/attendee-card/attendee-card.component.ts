import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { User } from '../../model/user';

@Component({
  selector: 'evendemy-attendee-card',
  templateUrl: './attendee-card.component.html',
  styleUrls: ['./attendee-card.component.scss']
})
export class AttendeeCardComponent implements OnInit {
  @Input() user: User;
  @Input() additionalAttendee: String;
  @Input() tookPart = false;
  @Input() showTakePartButton = false;
  @Input() showRemoveButton = false;
  @Input() disableTakePartButton = true;
  @Input() small = false;
  @Output() tookPartClicked: EventEmitter<User> = new EventEmitter<User>();
  @Output() removeAttendee: EventEmitter<User> = new EventEmitter<User>();

  constructor() {}

  ngOnInit() {}

  onClickTakePartButton() {
    this.tookPartClicked.emit(this.user);
  }

  onRemoveAttendee() {
    this.removeAttendee.emit(this.user);
  }
}
