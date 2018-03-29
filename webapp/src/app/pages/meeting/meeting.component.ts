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
import { User } from '../../model/user';
import * as toCSV from 'array-to-csv';
import * as FileSaver from 'file-saver';
import { ConfigService } from '@ngx-config/core';
import { UsersService } from '../../services/users.service';
import * as moment from 'moment';

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

  private imageFolder = this.config.getSettings().image_folder;

  private tmpImgData: any;

  private users: User[] = [];

  constructor(private client: Client, private meetingService: MeetingService, private route: ActivatedRoute,
    private router: Router, private store: Store<AppState>, private config: ConfigService) {
  }

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

    this.store.select('selectMeeting').subscribe(res => {
      this.meeting = res;
    });

    this.store.select('users').subscribe( res => this.users = res);
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

    this.client.getAllAttendingUsers(mid).subscribe((result) => {
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
    this.meetingService.createMeeting(this.meeting).subscribe((result: Meeting) => {
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
    if (this.tmpImgData) {
      const result = {
        mid: mid,
        data: this.tmpImgData.image
      };
      this.meetingService.addImage(mid, result).subscribe((img_result) => {
        console.log(img_result);
      });
    }
  }

  onDeleteMeeting() {
    console.log('delete meeting');
    this.meetingService.deleteMeeting(this.meeting.mid).subscribe((result) => {
      this.router.navigate(['/meeting-list/' + this.type]);
    });
  }

  openInNewView() {
    this.router.navigate(['/meeting/' + this.meeting.mid]);
  }

  onAcceptMeeting() {
    this.client.attendMeeting(this.meeting.mid, this.client.getLoggedInUsername()).subscribe((result) => {
      this.userHasAccepted = true;
      this.userHasFinished = false;
      this.loadPotentialAttendees(this.meeting.mid);
    });
  }

  onRejectMeeting() {
    this.client.rejectAttendingMeeting(this.meeting.mid, this.client.getLoggedInUsername()).subscribe((result) => {
      this.userHasAccepted = false;
      this.userHasFinished = false;
      this.loadPotentialAttendees(this.meeting.mid);
    });
  }

  onHasTakenPart(attendee: MeetingUser) {
    if (attendee && !attendee.tookPart) {
      attendee.tookPart = true;
      if(attendee.username === this.client.getLoggedInUsername()){
        this.userHasFinished = true;
      }
      this.client.confirmAttendeeToMeeting(this.meeting.mid, attendee.username).subscribe((result) => { });
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

  downloadCSV() {
    const headerCSV = [['Firstname', 'Lastname', 'email', 'has taken part']];

    const bodyCSV = this.potentialAttendees.map(a => {
      const user = this.users.find( u => u.username === a.username);
      if(user){
        return [user.firstname, user.lastname, user.email, a.tookPart.toString()]
      }
    });

    const csv = toCSV(headerCSV.concat(bodyCSV));

    var blob = new Blob([csv], { type: 'text/csv' });
    FileSaver.saveAs(blob, "attendees-for-meeting-" + this.meeting.mid + ".csv");

    console.log(csv);
  }

  setTemporaryImage(img: any) {
    this.tmpImgData = img;
  }

  getUser(username: string){
    const res = this.users.find( user => user.username === username);
    return res ? res : username;
  }

  getAttendedNumber() {
    return this.potentialAttendees.filter( p => p.tookPart === true).length;
  }

  getNotAttendedNumber() {
    return this.potentialAttendees.filter( p => p.tookPart !== true).length;
  }

  isInThePast() {
    const now = moment();
    return moment(this.meeting.date).isBefore(now, 'day');
  }

  isInThePastOrToday() {
    const now = moment();
    return moment(this.meeting.date).isSameOrBefore(now, 'day');
  }

  hasEveryoneTookPart() {
    return this.potentialAttendees.length == this.getAttendedNumber();
  }
}
