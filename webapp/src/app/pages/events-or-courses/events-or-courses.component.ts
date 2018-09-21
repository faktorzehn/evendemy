import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Meeting } from '../../model/meeting';
import { Store } from '@ngrx/store';
import { AppState } from '../../appState';
import { MeetingService } from '../../services/meeting.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'evendemy-events',
  templateUrl: './events-or-courses.component.html',
  styleUrls: ['./events-or-courses.component.scss']
})
export class EventsOrCoursesComponent implements OnInit, OnDestroy {

  public meetings: Meeting[] = [];
  public showNotAnnounced = true;
  public showOld = false;
  public showNew = true;
  private paramSubscription: Subscription;
  private type: string;

  constructor(private meetingsService: MeetingService, private route: ActivatedRoute, private router: Router,
    private store: Store<AppState>) {
    this.store.select('meetings').subscribe( res => this.meetings = res);
  }

  ngOnInit() {
    this.paramSubscription = this.route.params.subscribe(params => {
      this.type = params['type'];
      if (this.type !== 'course' && this.type !== 'event') {
        this.router.navigate(['/error']);
      }
      this.loadMeetings();
    });
    this.loadMeetings();
  }

  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
  }

  loadMeetings() {
    const options = {
      courseOrEvent: this.type,
      showNew: this.showNew,
      showOld: this.showOld,
      showNotAnnounced: this.showNotAnnounced
    };
    this.meetingsService.getAllMeetings(options);
  }

  onShowNotAnnounced(state: boolean) {
    this.showNotAnnounced = state;
    this.loadMeetings();
  }

  onShowNew(state: boolean) {
    this.showNew = state;
    this.loadMeetings();
  }

  onShowOld(state: boolean) {
    this.showOld = state;
    this.loadMeetings();
  }

}
