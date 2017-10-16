import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from './../middleware/client';
import { Meeting } from './../model/meeting';
import { MeetingComponent } from '../meeting/meeting.component';
import { Store } from '@ngrx/store';
import { AppState } from '../appState';
import { Observable } from 'rxjs/Observable';
import { MeetingService } from '../services/meeting.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css']
})
export class MeetingListComponent implements OnInit, OnDestroy {
  type: string;
  selectedMID = '';
  private sub: Subscription;
  meetings: Observable<Meeting[]>;
  private images = {};
  private randomizedNumber = Math.floor(Math.random() * 10000);
  public showNotAnnounced = true;
  public showOld = false;
  public showNew = true;

  constructor(private client: Client, private meetingService: MeetingService, private route: ActivatedRoute, private router: Router,
    private store: Store<AppState>) {
    this.meetings = store.select('meetings');
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.type = params['type'];
      if (this.type !== 'course' && this.type !== 'event') {
        this.router.navigate(['/error']);
      }
      this.loadMeetings(this.type);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  loadMeetings(type) {
    const options = {
      courseOrEvent: type,
      showNew: this.showNew,
      showOld: this.showOld,
      showNotAnnounced: this.showNotAnnounced
    };
    this.meetingService.getAllMeetings(options);
    this.meetings.subscribe((result) => {
      for (const meeting of result) {
        this.images[meeting.mid] = 'images/' + meeting.mid + '.jpg' + '?r=' + this.randomizedNumber;
      }
    });
  }

  getImage(mid: number) {
    if (!this.images) {
      return;
    }
    return this.images[mid];
  }

  onCheckboxClick() {
    this.loadMeetings(this.type);
  }

}
