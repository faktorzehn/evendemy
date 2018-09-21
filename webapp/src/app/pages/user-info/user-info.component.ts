import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../model/user';
import { Meeting } from '../../model/meeting';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EditorComponent } from '../../components/editor/editor.component';
import { AuthenticationService } from '../../services/authentication.service';
import { MeetingService } from '../../services/meeting.service';
import { MeetingsService } from '../../services/meetings.service.';
import { tap, first } from 'rxjs/operators';
import { MeetingUser } from '../../model/meeting_user';

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

  @ViewChild(EditorComponent)
  private editor: EditorComponent;

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

          if (this.user && this.user.additional_info && this.editor ) {
              this.editor.setValue(this.user.additional_info.description);
          }
        });
    }
  }

  private loadMeetings(username) {
    this.meetingsService
    .getMyMeetings(username)
    .subscribe((meeting_user_list: MeetingUser[]) => {
      if (meeting_user_list) {
        for (const meeting_user of meeting_user_list) {
          this.meetingService.getMeeting(meeting_user.mid)
            .subscribe((meeting_result: Meeting) => {
              const meeting: Meeting = meeting_result;
              if (meeting) {
                if (meeting.courseOrEvent === 'course') {
                  this.courses.push(meeting);
                } else {
                  this.events.push(meeting);
                }
              }
            });
        }
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
      data: data.image
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

  saveAdditionalInfo() {
    this.user.additional_info.description = this.editor.getValue();
    this.userService
      .updateAdditionalInfo(this.authService.getLoggedInUsername(), this.user.additional_info)
      .subscribe(o => {});
  }
}
