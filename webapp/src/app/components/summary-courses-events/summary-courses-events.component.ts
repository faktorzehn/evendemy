import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'evendemy-summary-courses-events',
  templateUrl: './summary-courses-events.component.html',
  styleUrls: ['./summary-courses-events.component.scss']
})
export class SummaryCoursesEventsComponent implements OnInit {

  @Input()
  number_of_created_meetings = 0;

  @Input()
  number_of_attended_meetings = 0;

  constructor() { }

  ngOnInit() {
  }

}
