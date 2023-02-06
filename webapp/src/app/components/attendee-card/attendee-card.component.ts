import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { User } from '../../model/user';

@Component({
  selector: 'evendemy-attendee-card',
  templateUrl: './attendee-card.component.html',
  styleUrls: ['./attendee-card.component.scss']
})
export class AttendeeCardComponent implements OnInit {
  @Input() username: '';
  @Input() firstname: '';
  @Input() lastname: '';

  @Input() additionalAttendee: String;
  @Input() tookPart = false;
  @Input() showTakePartButton = false;
  @Input() showRemoveButton = false;
  @Input() disableTakePartButton = true;
  @Input() small = false;
  @Output() tookPartClicked: EventEmitter<String> = new EventEmitter<String>();
  @Output() removeAttendee: EventEmitter<String> = new EventEmitter<String>();

  constructor() {}

  ngOnInit() {}

  onClickTakePartButton() {
    this.tookPartClicked.emit(this.username);
  }

  onRemoveAttendee() {
    this.removeAttendee.emit(this.username);
  }
}
