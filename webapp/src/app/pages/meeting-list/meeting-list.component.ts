import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { combineLatest, debounceTime, first } from 'rxjs';
import { BaseComponent } from '../../components/base/base.component';
import { Meeting } from '../../model/meeting';
import { MeetingUser } from '../../model/meeting_user';
import { AuthenticationService } from '../../services/authentication.service';
import { ConfigService } from '../../services/config.service';
import { MeetingsService } from '../../services/meetings.service';
import { TagsService } from '../../services/tags.service';

@Component({
  selector: 'evendemy-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss']
})
export class MeetingListComponent extends BaseComponent implements OnInit {

  public meetings: Meeting[] = [];
  public showNotAnnounced = true;
  public selectedTags = [];
  public allTags = [];
  public attendedMeetings: MeetingUser[] = [];
  public type = 'all';
  public date: 'all' | 'new' | 'old' | 'without' = 'all';
  public isIdea = false;
  public loading = false;

  constructor(
    private meetingsService: MeetingsService,
    private route: ActivatedRoute,
    private router: Router,
    private tagsService: TagsService,
    private authService: AuthenticationService,
    private configService: ConfigService<any>
  ) {
    super();
  }

  ngOnInit() {
    this.addSubscription(combineLatest([this.route.url, this.route.queryParams]).pipe(debounceTime(10)).subscribe(
      ([url, queryParams]) => {
        this.isIdea = url[0].toString().includes('ideas');

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

        if (queryParams['date']) {
          if (queryParams['date'] === 'old') {
            this.date = 'old';
          } else if (queryParams['date'] === 'new') {
            this.date = 'new';
          } else if (queryParams['date'] === 'without') {
            this.date = 'without';
          } else {
            this.date = 'all';
          }
        }

        this.loadMeetings();
        this.addSubscription(this.tagsService.getAllTags().pipe(first()).subscribe((tags: string[]) => {
          this.allTags = tags;
        }));

        //this.addSubscription(this.meetingsService.getAttendingInformationForMeetings(this.authService.getLoggedInUsername()).pipe(first()).subscribe(meeting_users => {
        //  this.attendedMeetings = meeting_users;
        //}));
      }
    ));
  }

  public loadMeetings() {
    const options = {
      type: this.type,
      idea: this.isIdea,
      showNew: this.date === 'all' || this.date === 'new',
      showOld: this.date === 'all' || this.date === 'old',
      showNotAnnounced: this.date === 'all' || this.date === 'without',
      tags: this.selectedTags
    };
    this.meetings = [];
    this.loading = true;
    this.addSubscription(this.meetingsService.getAllMeetings(options).pipe(first()).subscribe( meetings => {
      this.meetings = meetings;
      this.loading = false;
    }));
  }

  public onToolbarChange() {
    this.changeQuery();
  }

  public changeQuery() {
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: {
        type: this.type,
        date: this.date,
        'not-announced': this.showNotAnnounced,
        tags: this.selectedTags.join(',')
      }
    });
  }
}
