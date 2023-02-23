import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import * as FileSaver from 'file-saver';
import { combineLatest } from 'rxjs';

import { Step } from '../../components/breadcrump/breadcrump.component';
import { Comment } from '../../model/comment';
import { Meeting } from '../../model/meeting';
import { MeetingUser } from '../../model/meeting_user';
import { AuthenticationService } from '../../services/authentication.service';
import { MeetingService } from '../../services/meeting.service';
import { TagsService } from '../../services/tags.service';
import { MeetingUtil } from './meeting.util';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../../services/config.service';
import { BaseComponent } from '../../components/base/base.component';
import * as moment from 'moment';


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
export class MeetingComponent extends BaseComponent implements OnInit, OnDestroy {
  isNew: boolean;
  meeting: Meeting;
  potentialAttendees: MeetingUser[] = new Array<MeetingUser>();
  isEditable = false;
  userHasAccepted = false;
  userHasFinished = false;
  randomizedNumber = Math.floor(Math.random() * 10000);
  listView = false;
  tags = [];
  allTags = [];
  formGroup: FormGroup;
  steps: Step[] = [];

  imageFolder = this.configService.config.meeting_image_folder;
  tmpImgData: any;

  editorContent = "";

  contexMenuIsOpen = false;
  editMode = false;

  constructor(
    private authService: AuthenticationService,
    private meetingService: MeetingService,
    private route: ActivatedRoute,
    private router: Router,
    private configService: ConfigService<any>,
    private tagsService: TagsService,
    private formBuilder: FormBuilder) {
      super();
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      title: '',
      shortDescription: '',
      courseOrEvent: 'event',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      costCenter: '',
      numberOfAllowedExternals: 0,
      isFreetime: true
    });

    this.addSubscription(combineLatest([this.route.url, this.route.params]).subscribe(([url, params]) => {
      const mid = params['mid'];
      const isIdea = url[0].toString() === 'idea';

      if (mid !== undefined) {
        this.initForExistingMeeting(mid);
      } else {
        this.initForCreation(isIdea);
      }
    }));

    this.addSubscription(this.tagsService.getAllTags().subscribe((tags: string[]) => {
      this.allTags = tags;
    }));

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

    this.location.setValidators([
      requiredIfNotAnIdea(meeting.isIdea)
    ]);

    this.date.updateValueAndValidity();
    this.startTime.updateValueAndValidity();
    this.endTime.updateValueAndValidity();
    this.location.updateValueAndValidity();
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

  get title() {
    return this.formGroup.get('title');
  }

  get shortDescription() {
    return this.formGroup.get('shortDescription');
  }

  get courseOrEvent() {
    return this.formGroup.get('courseOrEvent');
  }

  get location() {
    return this.formGroup.get('location');
  }

  get costCenter() {
    return this.formGroup.get('costCenter');
  }

  private initForCreation(isIdea) {
    this.isNew = true;

    this.meeting = new Meeting();
    this.meeting.username = this.authService.getLoggedInUsername();
    this.meeting.numberOfAllowedExternals = 0;
    this.meeting.isFreetime = true;
    this.meeting.isIdea = !!isIdea;
    this.courseOrEvent.patchValue('event');

    this.editMode = true;
    this.isEditable = true;
    this.editorContent = '';

    this.steps = [
      {href: this.meeting.isIdea ? 'ideas' : 'meetings', title: this.meeting.isIdea ? 'Ideas' : 'Meetings'},
      {title: 'new'}
    ];
  }

  public editorChanged(text: string){
    this.editorContent = text;
  }

  public initForExistingMeeting(mid: string) {
    this.isNew = false;

    this.loadMeeting(mid);
    this.loadPotentialAttendees(mid);
  }

  loadMeeting(mid) {
    this.addSubscription(this.meetingService.getMeeting(mid).pipe(first()).subscribe((meeting) => {
      this.meeting = meeting;
      this.courseOrEvent.patchValue(this.meeting.courseOrEvent);
      this.editorContent = this.meeting.description;
      this.isEditable = this.authService.getLoggedInUsername() === this.meeting.username;
    
      this.setForm(this.meeting);
      this.tags = meeting.tags;

      this.steps = [
        {href: this.meeting.isIdea ? 'ideas' : 'meetings', title: this.meeting.isIdea ? 'Ideas' : 'Meetings'},
        {title: this.meeting.title }
      ];
    }));
  }

  setForm(meeting: Meeting) {
    this.formGroup.patchValue({
      title: meeting.title,
      shortDescription: meeting.shortDescription,
      courseOrEvent: meeting.courseOrEvent,
      date: MeetingUtil.dateToString(this.meeting.startTime),
      startTime: MeetingUtil.dateToTimeString(this.meeting.startTime),
      endTime: MeetingUtil.dateToTimeString(this.meeting.endTime),
      location: meeting.location,
      costCenter: meeting.costCenter,
      numberOfParticipants: meeting.numberOfAllowedExternals,
      isFreetime: meeting.isFreetime
    });
  }

  loadPotentialAttendees(mid) {
    this.userHasAccepted = false;
    this.userHasFinished = false;

    this.addSubscription(this.meetingService.getAllAttendingUsers(mid).subscribe((result) => {
      this.potentialAttendees = result;
      const attendee = this.potentialAttendees.find(a => a.username === this.authService.getLoggedInUsername());
      if (attendee) {
        this.userHasAccepted = true;
        this.userHasFinished = attendee.tookPart;
      }
    }));
  }

  onSaveMeeting() {
    if (this.meeting.mid !== undefined && this.meeting.mid !== null) {
      this.updateMeeting();
    } else {
      this.createMeeting();
    }
  }

  onCancel() {
    this.setForm(this.meeting);
    this.editMode = false;
  }

  createMeetingObject(): Meeting {
    var meeting = new Meeting();
    meeting.mid = this.meeting.mid;
    meeting.title = this.title.value;
    meeting.shortDescription = this.shortDescription.value;
    meeting.courseOrEvent = this.courseOrEvent.value;
    meeting.description = this.editorContent;
    var date = MeetingUtil.stringToDate(this.date.value);

    var startTime = this.startTime.value.split(':');
    meeting.startTime = moment(date).hours(startTime[0]).minutes(startTime[1]).toDate();
    
    var endTime = this.endTime.value.split(':');
    meeting.endTime = moment(date).hours(endTime[0]).minutes(endTime[1]).toDate();

    meeting.location = this.location.value;
    meeting.costCenter = this.costCenter.value;
    meeting.numberOfAllowedExternals = this.formGroup.get('numberOfAllowedExternals').value;
    meeting.username = this.authService.getLoggedInUsername();
    meeting.isFreetime = this.formGroup.get('isFreetime').value; 
    meeting.tags = this.tags;
    return meeting;
  }

  createMeeting() {
    var meeting = this.createMeetingObject();
    this.addSubscription(this.meetingService.createMeeting(meeting).pipe(first()).subscribe((result: Meeting) => {
      this.meeting = result;
      this.uploadImage(this.meeting.mid);
      this.navigateBack();
    }));
  }

  updateMeeting() {
    this.uploadImage(this.meeting.mid);
    var meeting = this.createMeetingObject();
    this.addSubscription(this.meetingService.updateMeeting(meeting).pipe(first()).subscribe((result) => {
      this.navigateBack();
    }));
  }

  private navigateBack() {
    if (this.meeting.isIdea) {
      this.router.navigate(['/ideas']);
      return;
    }
    this.router.navigate(['/meetings']);
  }

  uploadImage(mid: number) {
    if (this.tmpImgData) {
      const result = {
        mid: mid,
        data: this.tmpImgData
      };
      this.addSubscription(this.meetingService.addImage(mid, result).pipe(first()).subscribe((img_result) => {}));
    }
  }

  onDeleteMeeting() {
    this.addSubscription(this.meetingService.deleteMeeting(this.meeting.mid).pipe(first()).subscribe((result) => {
      this.router.navigate(['/meetings']);
    }));
  }

  createCopy() {
    const meeting = { ... this.meeting };
    meeting.mid = null;
    meeting.comments = [];
    meeting.creationDate = null;
    meeting.username = null;
    return meeting;
  }

  onCopy() {
    this.meeting = this.createCopy();
    this.potentialAttendees = [];
    this.isNew = true;
    this.userHasAccepted = false;
    this.userHasFinished = false;
  }

  onMakeAMeeting() {
    this. meeting = this.createCopy();
    this.meeting.isIdea = false;

    this.potentialAttendees = [];
    this.isNew = true;
    this.userHasAccepted = false;
    this.userHasFinished = false;
  }

  onAcceptMeeting(external) {
    this.addSubscription(this.meetingService.attendMeeting(this.meeting.mid, this.authService.getLoggedInUsername(), external)
      .pipe(first()).subscribe((result) => {
        this.userHasAccepted = true;
        this.userHasFinished = false;
        this.loadPotentialAttendees(this.meeting.mid);
    }));
  }

  onRejectMeeting() {
    this.addSubscription(this.meetingService.rejectAttendingMeeting(this.meeting.mid, this.authService.getLoggedInUsername())
      .pipe(first()).subscribe((result) => {
        this.userHasAccepted = false;
        this.userHasFinished = false;
        this.loadPotentialAttendees(this.meeting.mid);
    }));
  }

  onRemoveAttendee(username: string) {
    this.addSubscription(this.meetingService.rejectAttendingMeeting(this.meeting.mid, username)
      .pipe(first()).subscribe((result) => {
        this.loadPotentialAttendees(this.meeting.mid);
    }));
  }

  onHasTakenPart(username: string) {
    if (username) {
      const foundedAttendee = this.potentialAttendees.find(p => p.username === username);
      foundedAttendee.tookPart = true;
      if (foundedAttendee.username === this.authService.getLoggedInUsername()) {
        this.userHasFinished = true;
      }
      this.addSubscription(this.meetingService.confirmAttendeeToMeeting(this.meeting.mid, foundedAttendee.username).pipe(first()).subscribe((result) => { }));
    }
  }

  onAddComment(comment: Comment) {
    this.addSubscription(this.meetingService.addComment(this.meeting.mid, comment).pipe(first()).subscribe((meeting) => {
      this.meeting.comments = meeting.comments;
    }));
  }

  downloadCSV() {
    const csv = MeetingUtil.generateCSV(this.potentialAttendees);
    const blob = new Blob([csv], { type: 'text/csv' });
    FileSaver.saveAs(blob, 'attendees-for-meeting-' + this.meeting.mid + '.csv');
  }

  onGetCalendar() {
    this.addSubscription(this.meetingService.getCalendar(this.meeting.mid).pipe(first()).subscribe( (cal: any) => {
      const blob = new Blob([cal.content], { type: 'text/calendar;charset=utf-8' });
      FileSaver.saveAs(blob, 'calendar-for-meeting-' + this.meeting.mid + '.ics');
    }));
  }

  setTemporaryImage(img: any) {
    this.tmpImgData = img;
  }

  getAttendedNumber() {
    return this.potentialAttendees.filter( p => p.tookPart === true).length;
  }

  getNotAttendedNumber() {
    return this.potentialAttendees.filter( p => p.tookPart !== true).length;
  }

  hasValidDateAndTime() {
    return MeetingUtil.hasValidDateAndTime(this.meeting);
  }

  isInThePast() {
    return MeetingUtil.isInThePast(this.meeting);
  }

  isInThePastOrToday() {
    return MeetingUtil.isInThePastOrToday(this.meeting);
  }

  hasEveryoneTookPart() {
    return this.potentialAttendees.length === this.getAttendedNumber();
  }

  numberOfParticipants() {
    const externals = this.potentialAttendees.filter(p => p.externals.length > 0);
    return this.potentialAttendees.length + externals.length;
  }

  onTagSelect(tag: string) {
    this.router.navigate(['/meetings', this.courseOrEvent.value], {queryParams: {tags: tag}});
  }

  onAddingTag() {
    this.tags = this.tags.map(tag => tag.toLowerCase()).map(tag => tag.replace(/ /g, '-'));
  }

  getStatus() {
    return MeetingUtil.mapStatus(this.isNew,  this.userHasAccepted, this.userHasFinished);
  }
}
