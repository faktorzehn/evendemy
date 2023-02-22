import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../model/user';
import { Meeting } from '../../../model/meeting';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { MeetingService } from '../../../services/meeting.service';
import { MeetingsService } from '../../../services/meetings.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'evendemy-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  username: string;
  editable = false;
  user: User;
  courses: Meeting[] = [];
  events: Meeting[] = [];
  courses_from_author: Meeting[] = [];
  events_from_author: Meeting[] = [];
  editorContent = '';

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private meetingService: MeetingService,
    private meetingsService: MeetingsService
  ) {}

  ngOnInit() {
    this.route.params.pipe(first()).subscribe(params => {
      if (params['username']) {
        this.username = params['username'];
      } else {
        this.username = this.authService.getLoggedInUsername();
        this.editable = true;
      }

      this.loadUser(this.username);
      this.loadMeetings(this.username);
    });

  }

  private loadUser(username) {
    if (username !== undefined) {
      this.userService
        .getUserByUsername(username)
        .subscribe((result: User) => {
          this.user = result;

          if (this.user && this.user.additional_info) {
            this.editorContent = this.user.additional_info.description;
          }
        });
    }
  }

  private loadMeetings(username) {
    this.meetingsService
    .getMyConfirmedMeetings(username)
    .subscribe((meetings: Meeting[]) => {
      if (meetings) {
        this.courses = [...this.courses, ...meetings.filter(m => m.courseOrEvent === 'course')];
        this.events = [...this.events, ...meetings.filter(m => m.courseOrEvent !== 'course')];
      }
    });

  this.meetingsService
    .getMeetingsFromAuthor(this.username)
    .subscribe((result: Meeting[]) => {
      this.courses_from_author = result.filter(meeting => meeting.courseOrEvent === 'course');
      this.events_from_author = result.filter(meeting => meeting.courseOrEvent === 'event');
    });
  }

  uploadImage(data) {
    const postData = {
      username: this.authService.getLoggedInUsername(),
      data: data
    };
    this.userService
      .addImage(this.authService.getLoggedInUsername(), postData)
      .subscribe(img_result => {});
  }

  deleteImage() {
    this.userService
      .deleteImage(this.authService.getLoggedInUsername())
      .subscribe(img_result => {});
  }

  onUpdateSettings() {
    this.userService
      .updateSettings(this.authService.getLoggedInUsername(), this.user.options)
      .subscribe(o => {});
  }

  public editorChanged(text: string){
    this.editorContent = text;
    this.user.additional_info.description = this.editorContent;
    this.saveAdditionalInfo();
  }

  public saveAdditionalInfo() {
    this.userService
      .updateAdditionalInfo(this.authService.getLoggedInUsername(), this.user.additional_info)
      .subscribe(o => {});
  }
}
