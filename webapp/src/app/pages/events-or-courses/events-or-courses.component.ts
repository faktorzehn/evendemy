import { Component, OnInit, OnDestroy } from '@angular/core';
import { Meeting } from '../../model/meeting';
import { Store } from '@ngrx/store';
import { AppState } from '../../appState';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingsService } from '../../services/meetings.service';
import { TagsService } from '../../services/tags.service';
import { combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';

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
  private type: string;
  private sub;

  constructor(
    private meetingsService: MeetingsService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private tagsService: TagsService
  ) {
    this.store.select('meetings').subscribe(res => (this.meetings = res));
  }

  ngOnInit() {
    this.sub = combineLatest(this.route.params, this.route.queryParams).subscribe(
      ([params, queryParams]) => {
        this.type = params['type'];
        if (this.type !== 'course' && this.type !== 'event') {
          this.router.navigate(['/error']);
        }

        if (queryParams['tags']) {
          this.selectedTags = queryParams['tags'].split(',');
        }

        if (queryParams['new']) {
          this.showNew = queryParams['new'] === 'true';
        }

        if (queryParams['not-announced']) {
          this.showNotAnnounced = queryParams['not-announced'] === 'true';
        }

        if (queryParams['old']) {
          this.showOld = queryParams['old'] === 'true';
        }

        this.loadMeetings();
        this.tagsService.getAllTags().subscribe((tags: string[]) => {
          this.allTags = tags;
        });
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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
    this.changeQuery();
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

  private changeQuery() {
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        new: this.showNew,
        old: this.showOld,
        'not-announced': this.showNotAnnounced,
        tags: this.selectedTags.join(',')
      }
    });
  }
}
