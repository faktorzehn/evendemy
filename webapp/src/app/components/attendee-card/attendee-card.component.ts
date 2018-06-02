import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { User } from '../../model/user';

@Component({
  selector: 'evendemy-attendee-card',
  templateUrl: './attendee-card.component.html',
  styleUrls: ['./attendee-card.component.scss']
})
export class AttendeeCardComponent implements OnInit {
  @Input() user: User;
  @Input() additional_attendees = 0;
  @Input() tookPart = false;
  @Input() showTakePartButton = false;
  @Input() disableTakePartButton = true;
  @Output() clickTakePartButton: EventEmitter<User> = new EventEmitter<User>();

  constructor() {}

  ngOnInit() {}

  onClickTakePartButton() {
    this.clickTakePartButton.emit(this.user);
  }
}
