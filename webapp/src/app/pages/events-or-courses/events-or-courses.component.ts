import { Component, OnInit, OnDestroy } from '@angular/core';
import { Meeting } from '../../model/meeting';
import { Store } from '@ngrx/store';
import { AppState } from '../../appState';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingsService } from '../../services/meetings.service';
import { TagsService } from '../../services/tags.service';
import { combineLatest } from 'rxjs';
import { debounceTime, first } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication.service';
import { MeetingUser } from '../../model/meeting_user';

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
  public attendedMeetings: MeetingUser[] = [];
  public type = 'all';
  public isIdea = false;
  public loading = false;
  private sub;

  constructor(
    private meetingsService: MeetingsService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private tagsService: TagsService,
    private authService: AuthenticationService
  ) {
    this.store.select('meetings').subscribe(res => {
      this.meetings = res;
      this.loading = false;
    });
  }

  ngOnInit() {
    this.sub = combineLatest(this.route.url, this.route.queryParams).pipe(debounceTime(10)).subscribe(
      ([url, queryParams]) => {
        this.isIdea = url[0].toString() === 'ideas';

        if (queryParams['type']) {
          if (queryParams['type'] === 'event') {
            this.type = 'event';
          } else if (queryParams['type'] === 'course') {
            this.type = 'course';
          } else {
            this.type = 'all';
          }
        }

        this.selectedTags = [];
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
        this.tagsService.getAllTags().pipe(first()).subscribe((tags: string[]) => {
          this.allTags = tags;
        });

        this.meetingsService.getMyAttendingMeetings(this.authService.getLoggedInUsername()).pipe(first()).subscribe(meeting_users => {
          this.attendedMeetings = meeting_users;
        });
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public loadMeetings() {
    const options = {
      type: this.type,
      idea: this.isIdea,
      showNew: this.showNew,
      showOld: this.showOld,
      showNotAnnounced: this.showNotAnnounced,
      tags: this.selectedTags
    };
    this.meetings = [];
    this.loading = true;
    this.meetingsService.getAllMeetings(options);
  }

  public onShowNotAnnounced(state: boolean) {
    this.showNotAnnounced = state;
    this.changeQuery();
  }

  public onShowNew(state: boolean) {
    this.showNew = state;
    this.changeQuery();
  }

  public onShowOld(state: boolean) {
    this.showOld = state;
    this.changeQuery();
  }

  public onToolbarChange() {
    this.changeQuery();
  }

  public changeQuery() {
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        type: this.type,
        new: this.showNew,
        old: this.showOld,
        'not-announced': this.showNotAnnounced,
        tags: this.selectedTags.join(',')
      }
    });
  }
}
