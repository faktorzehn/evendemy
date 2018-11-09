import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Meeting } from '../../model/meeting';
import { Comment } from '../../model/comment';
import { MeetingUser } from '../../model/meeting_user';
import { EditorComponent } from '../../components/editor/editor.component';
import { MeetingService } from '../../services/meeting.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../appState';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../model/user';
import * as FileSaver from 'file-saver';
import { ConfigService } from '@ngx-config/core';
import * as moment from 'moment';
import { MeetingUtil } from './meeting.util';
import { AuthenticationService } from '../../services/authentication.service';
import { TagsService } from '../../services/tags.service';
import { FormGroup, FormControl, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';


export function requiredIfNotAnIdea(isIdea: boolean): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    if (isIdea === null || isIdea === undefined || isIdea === true) {
      return null;
    }
    return control.value ? null : {'required': {value: control.value}};
  };
}

@Component({
  selector: 'evendemy-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
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
  randomizedNumber = Math.floor(Math.random() * 10000);
  listView = false;
  allTags = [];
  formGroup: FormGroup;

  @ViewChild(EditorComponent)
  private editor: EditorComponent;

  imageFolder = this.config.getSettings().meeting_image_folder;
  tmpImgData: any;

  users: User[] = [];

  constructor(
    private authService: AuthenticationService,
     private meetingService: MeetingService,
     private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private config: ConfigService,
    private tagsService: TagsService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.subscribe = this.route.params.subscribe(params => {
      const type = params['type'];
      const mid = params['mid'];
      if (mid === 'new') {
        console.error('Routing has some error! mid should not be new');
      }
      if (type) {
        this.initForCreation(type);
      } else if (mid) {
        this.initForExistingMeeting(mid);
      }
    });

    this.formGroup = this.formBuilder.group({
      date: '',
      startTime: '',
      endTime: ''
    });

    this.store.select('selectMeeting').subscribe(res => {
      if (res) {
        this.meeting = res;
        this.formGroup.patchValue({date: MeetingUtil.dateToString(res.date)});
        this.formGroup.patchValue({startTime: res.startTime});
        this.formGroup.patchValue({endTime: res.endTime});
        this.updateValidators(res);
      }
    });

    this.store.select('users').subscribe( res => this.users = res);

    this.tagsService.getAllTags().subscribe((tags: string[]) => {
      this.allTags = tags;
    });
  }

  updateValidators(meeting) {
    if (!meeting) {
      return;
    }

    this.date.setValidators([
      Validators.pattern(/^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/g),
      requiredIfNotAnIdea(meeting.isIdea)
    ]);
    this.startTime.setValidators([
      Validators.pattern(/(0?[0-9]|[1][0-9]|2[0-4]):([0-4][0-9]|5[0-9])/g),
      requiredIfNotAnIdea(meeting.isIdea)
    ]);
    this.endTime.setValidators([
      Validators.pattern(/(0?[0-9]|[1][0-9]|2[0-4]):([0-4][0-9]|5[0-9])/g),
      requiredIfNotAnIdea(meeting.isIdea)
    ]);

    this.date.updateValueAndValidity();
    this.startTime.updateValueAndValidity();
    this.endTime.updateValueAndValidity();
  }

  get date() {
    return this.formGroup.get('date');
  }

  get startTime() {
    return this.formGroup.get('startTime');
  }

  get endTime() {
    return this.formGroup.get('endTime');
  }

  private initForCreation(type: string) {
    this.type = type;
    this.isNew = true;
    this.type = MeetingUtil.mapType(this.type);

    const meeting = new Meeting();
    meeting.courseOrEvent = this.type;
    meeting.numberOfAllowedExternals = 0;
    meeting.isIdea = false;
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

  ngOnDestroy() {
    this.meetingService.unloadMeeting();
    this.subscribe.unsubscribe();
  }

  loadMeeting(mid) {
    this.meetingService.getMeetingAndSelect(mid).subscribe((result) => {
      this.type = this.meeting.courseOrEvent;
      if (this.editor) {
        this.editor.setValue(this.meeting.description);
      }
      this.isEditable = this.authService.getLoggedInUsername() === this.meeting.username;
    });
  }

  loadPotentialAttendees(mid) {
    this.userHasAccepted = false;
    this.userHasFinished = false;

    this.meetingService.getAllAttendingUsers(mid).subscribe((result) => {
      this.potentialAttendees = result;
      const attendee = this.potentialAttendees.find(a => a.username === this.authService.getLoggedInUsername());
      if (attendee) {
        this.userHasAccepted = true;
        this.userHasFinished = attendee.tookPart;
      }
    });
  }

  onSaveMeeting() {
    if (this.meeting.mid) {
      this.updateMeeting();
    } else {
      this.createMeeting();
    }
  }

  createMeeting() {
    this.meeting.description = this.editor.getValue();
    this.meeting.date = MeetingUtil.stringToDate(this.date.value);
    this.meeting.startTime = this.startTime.value;
    this.meeting.endTime = this.endTime.value;
    this.meetingService.createMeeting(this.meeting).subscribe((result: Meeting) => {
      this.meeting = result;
      this.uploadImage(this.meeting.mid);
      this.router.navigate(['/meeting-list/' + this.type]);
    });
  }

  updateMeeting() {
    this.uploadImage(this.meeting.mid);
    this.meeting.description = this.editor.getValue();
    this.meeting.date = MeetingUtil.stringToDate(this.date.value);
    this.meeting.startTime = this.startTime.value;
    this.meeting.endTime = this.endTime.value;
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
      this.meetingService.addImage(mid, result).subscribe((img_result) => {});
    }
  }

  onDeleteMeeting() {
    this.meetingService.deleteMeeting(this.meeting.mid).subscribe((result) => {
      this.router.navigate(['/meeting-list/' + this.type]);
    });
  }

  onCopyMeeting() {
    const meeting = { ... this.meeting };
    meeting.mid = null;
    meeting.comments = [];
    meeting.creationDate = null;
    meeting.username = null;
    this.potentialAttendees = [];
    this.isNew = true;
    this.userHasAccepted = false;
    this.userHasFinished = false;

    this.meetingService.selectMeeting(meeting);
  }

  onAcceptMeeting(external) {
    this.meetingService.attendMeeting(this.meeting.mid, this.authService.getLoggedInUsername(), external).subscribe((result) => {
      this.userHasAccepted = true;
      this.userHasFinished = false;
      this.loadPotentialAttendees(this.meeting.mid);
    });
  }

  onRejectMeeting() {
    this.meetingService.rejectAttendingMeeting(this.meeting.mid, this.authService.getLoggedInUsername()).subscribe((result) => {
      this.userHasAccepted = false;
      this.userHasFinished = false;
      this.loadPotentialAttendees(this.meeting.mid);
    });
  }

  onHasTakenPart(attendee: MeetingUser) {
    if (attendee && !attendee.tookPart) {
      const foundedAttendee = this.potentialAttendees.find(p => p.username === attendee.username);
      foundedAttendee.tookPart = true;
      if (foundedAttendee.username === this.authService.getLoggedInUsername()) {
        this.userHasFinished = true;
      }
      this.meetingService.confirmAttendeeToMeeting(this.meeting.mid, foundedAttendee.username).subscribe((result) => { });
    }
  }

  onAddComment(comment: Comment) {
    this.meetingService.addComment(this.meeting.mid, comment).subscribe((result) => {});
  }

  downloadCSV() {
    const csv = MeetingUtil.generateCSV(this.potentialAttendees, this.users);

    const blob = new Blob([csv], { type: 'text/csv' });
    FileSaver.saveAs(blob, 'attendees-for-meeting-' + this.meeting.mid + '.csv');

    console.log(csv);
  }

  onGetCalendar() {
    this.meetingService.getCalendar(this.meeting.mid).subscribe( (cal: any) => {
      const blob = new Blob([cal.content], { type: 'text/calendar;charset=utf-8' });
      FileSaver.saveAs(blob, 'calendar-for-meeting-' + this.meeting.mid + '.ics');

    });
  }

  setTemporaryImage(img: any) {
    this.tmpImgData = img;
  }

  getUser(username: string) {
    const res = this.users.find( user => user.username === username);
    return res ? res : username;
  }

  getAttendedNumber() {
    return this.potentialAttendees.filter( p => p.tookPart === true).length;
  }

  getNotAttendedNumber() {
    return this.potentialAttendees.filter( p => p.tookPart !== true).length;
  }

  hasValidDate() {
    return this.meeting.startTime && this.meeting.endTime && this.meeting.date;
  }

  isInThePast() {
    if (!this.hasValidDate()) {
      return false;
    }
    const now = moment();
    return moment(this.meeting.date).isBefore(now, 'day');
  }

  isInThePastOrToday() {
    if (!this.hasValidDate()) {
      return false;
    }
    const now = moment();
    return moment(this.meeting.date).isSameOrBefore(now, 'day');
  }

  hasEveryoneTookPart() {
    return this.potentialAttendees.length === this.getAttendedNumber();
  }

  trackByFn (user: User) {
    return user.username;
  }

  checkboxChanged() {
    this.meeting.numberOfAllowedExternals === 0 ? this.meeting.numberOfAllowedExternals = 1 : this.meeting.numberOfAllowedExternals = 0;
  }

  numberOfParticipants() {
    const externals = this.potentialAttendees.filter(p => p.externals.length > 0);
    return this.potentialAttendees.length + externals.length;
  }

  onTagSelect(tag: string) {
    this.router.navigate(['/meeting-list/', this.type], {queryParams: {tags: tag}});
  }

  onAddingTag() {
    this.meeting.tags = this.meeting.tags.map(tag => tag.toLowerCase()).map(tag => tag.replace(/ /g, '-'));
  }
}
