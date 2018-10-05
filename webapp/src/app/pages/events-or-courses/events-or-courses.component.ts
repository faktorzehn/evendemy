import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Meeting } from '../../model/meeting';
import { Store } from '@ngrx/store';
import { AppState } from '../../appState';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingsService } from '../../services/meetings.service';
import { TagsService } from '../../services/tags.service';

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
  public selectedTags = [];
  public allTags = [];
  private paramSubscription: Subscription;
  private type: string;


  constructor(private meetingsService: MeetingsService, private route: ActivatedRoute, private router: Router,
    private store: Store<AppState>, private tagsService: TagsService) {
    this.store.select('meetings').subscribe( res => this.meetings = res);
  }

  ngOnInit() {
    this.paramSubscription = this.route.params.subscribe(params => {
      this.type = params['type'];
      if (this.type !== 'course' && this.type !== 'event') {
        this.router.navigate(['/error']);
      }

      if(params['tags']) {
        this.selectedTags = params['tags'].split(',');
      }
      this.loadMeetings();
      this.tagsService.getAllTags().subscribe((tags: string[]) => {
        this.allTags = tags;
      });
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
      showNotAnnounced: this.showNotAnnounced,
      tags: this.selectedTags
    };
    this.meetingsService.getAllMeetings(options);
  }

  public onShowNotAnnounced(state: boolean) {
    this.showNotAnnounced = state;
    this.loadMeetings();
  }

  public onShowNew(state: boolean) {
    this.showNew = state;
    this.loadMeetings();
  }

  public onShowOld(state: boolean) {
    this.showOld = state;
    this.loadMeetings();
  }

  public onTagsChanged() {
    this.loadMeetings();
  }

}
