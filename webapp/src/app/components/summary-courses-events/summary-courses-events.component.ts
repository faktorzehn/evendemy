import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'evendemy-summary-courses-events',
  templateUrl: './summary-courses-events.component.html',
  styleUrls: ['./summary-courses-events.component.scss']
})
export class SummaryCoursesEventsComponent implements OnInit {

  @Input()
  numberOfCreatedMeetings = 0;

  @Input()
  numberOfAttendedMeetings = 0;

  constructor() { }

  ngOnInit() {
  }

}
