import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Client } from './../../middleware/client';
import { Meeting } from './../../model/meeting';
import { Comment } from './../../model/comment';
import { MeetingUser } from './../../model/meeting_user';
import { EditorComponent } from '../../components/editor/editor.component';
import { MeetingService } from '../../services/meeting.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState } from '../../appState';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit, OnDestroy {
  type: string;
  isNew: boolean;
  subscribe: Subscription;
  meeting: Meeting;
  potentialAttendees: MeetingUser[] = new Array<MeetingUser>();
  isEditable = false;
  userHasAccepted = false;
  userHasFinished = false;
  commentbox = '';
  inputDate = '';
  randomizedNumber = Math.floor(Math.random() * 10000);

  @ViewChild(EditorComponent)
  private editor: EditorComponent;

  constructor(private client: Client, private meetingService: MeetingService, private route: ActivatedRoute,
    private router: Router, private store: Store<AppState>) { }

  ngOnInit() {
    this.subscribe = this.route.params.subscribe(params => {
      const type = params['type'];
      const mid = params['mid'];
      if (mid === 'new') {
        console.error('Routing has some error! mid should not be new');
      };
      if (type) {
        this.initForCreation(type);
      } else if (mid) {
        this.initForExistingMeeting(mid);
      }
    });

    this.store.select('selectMeeting').subscribe( res => {
      this.meeting = res;
    });
  }

  private initForCreation(type: string) {
    this.type = type;
    this.isNew = true;
    this.type = this.mapType(this.type);

    const meeting = new Meeting();
    meeting.courseOrEvent = this.type;
    this.meetingService.selectMeeting(meeting);

    this.isEditable = true;
    if (this.editor) {
      this.editor.setValue('');
    }
  }

  public initForExistingMeeting(mid: string) {
    this.isNew = false;

    this.loadMeeting(mid);
    this.loadPotentialAttendees(mid);
  }

  mapType(type: string) {
    if (type === 'course' || type === 'event') {
      return type;
    }
    return 'course';
  }

  ngOnDestroy() {
    this.meetingService.unloadMeeting();
    this.subscribe.unsubscribe();
  }

  loadMeeting(mid) {
    this.meetingService.loadMeeting(mid).subscribe((result) => {
      this.type = this.meeting.courseOrEvent;
      if (this.editor) {
        this.editor.setValue(this.meeting.description);
      }
      this.isEditable = this.client.getLoggedInUsername() === this.meeting.username;
      if (this.meeting.date) {
        this.meeting.date = new Date(this.meeting.date);
        this.inputDate = this.convertDateToString(this.meeting.date);
      }
    });
  }

  convertDateToString(value: Date) {
    if (value) {
      const day = value.getDate();
      const month = value.getMonth() + 1;
      const year = value.getFullYear();
      return day + '.' + month + '.' + year;
    }
    return '';
  }

  convertStringToDate(value: string) {
    if (value) {
      const valueArray = value.split('.');
      const day = parseInt(valueArray[0], 10);
      const month = parseInt(valueArray[1], 10) - 1;
      const year = parseInt(valueArray[2], 10);
      return new Date(year, month, day);
    }
    return null;
  }

  loadPotentialAttendees(mid) {
    this.userHasAccepted = false;
    this.userHasFinished = false;

    this.client.getAllMeetingUsers({ 'mid': mid }).subscribe((result) => {
      this.potentialAttendees = result;
      const attendee = this.potentialAttendees.find(a => a.username === this.client.getLoggedInUsername());
      if (attendee) {
        this.userHasAccepted = true;
        this.userHasFinished = attendee.tookPart;
      };
    });
  }

  onCreateMeeting() {
    this.meeting.description = this.editor.getValue();
    this.meeting.date = this.convertStringToDate(this.inputDate);
    this.meetingService.createMeeting(this.meeting).subscribe((result) => {
      this.meeting = result;
      this.uploadImage(this.meeting.mid);
      this.router.navigate(['/meeting-list/' + this.type]);
    });
  }

  onUpdateMeeting() {
    this.uploadImage(this.meeting.mid);
    this.meeting.description = this.editor.getValue();
    this.meeting.date = this.convertStringToDate(this.inputDate);
    this.meetingService.updateMeeting(this.meeting).subscribe((result) => {
      this.router.navigate(['/meeting-list/' + this.type]);
    });
  }

  uploadImage(mid: number) {
    const x = document.forms['form']['file-upload'].files[0];
    const reader = new FileReader();
    reader.addEventListener('load', function () {
      const image = reader.result.replace('data:image/jpeg;base64,', '');
      const result = {
        mid: mid,
        data: image
      };
      this.meetingService.addImage(mid, result).subscribe((img_result) => {
        console.log(img_result);
      });
    }.bind(this), false);

    if (x) {
      reader.readAsDataURL(x);
    }
  }

  onDeleteMeeting() {
    this.meetingService.deleteMeeting(this.meeting.mid).subscribe((result) => {
      this.router.navigate(['/meeting-list/' + this.type]);
    });
  }

  openInNewView() {
    this.router.navigate(['/meeting/' + this.meeting.mid]);
  }

  onAcceptMeeting() {
    const m_u = new MeetingUser(this.meeting.mid, this.client.getLoggedInUsername(), false);
    this.client.createMeeting_User(m_u).subscribe((result) => {
      this.userHasAccepted = true;
      this.userHasFinished = false;
      this.loadPotentialAttendees(this.meeting.mid);
    });
  }

  onRejectMeeting() {
    this.client.deleteMeeting_UserByMIdAndUsername(this.meeting.mid, this.client.getLoggedInUsername()).subscribe((result) => {
      this.userHasAccepted = false;
      this.userHasFinished = false;
      this.loadPotentialAttendees(this.meeting.mid);
    });
  }

  onHasTakenPart(attendee: MeetingUser) {
    if (attendee && !attendee.tookPart) {
      attendee.tookPart = true;
      this.client.updateMeeting_User(attendee).subscribe((result) => { });
    }
  }

  onAddComment() {
    const comment = new Comment();
    comment.author = this.client.getLoggedInUsername();
    comment.text = this.commentbox;

    this.meetingService.addComment(this.meeting.mid, comment).subscribe((result) => {
        this.commentbox = '';
    });
  }
}
