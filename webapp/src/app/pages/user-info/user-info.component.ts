import { Component, OnInit, ViewChild } from '@angular/core';
import { Client } from '../../middleware/client';
import { User } from '../../model/user';
import { MeetingUser } from '../../model/meeting_user';
import { Meeting } from '../../model/meeting';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EditorComponent } from '../../components/editor/editor.component';
import { AuthenticationService } from '../../services/authentication.service';

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
    private client: Client,
    private authService: AuthenticationService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const subscribe = this.route.params.subscribe(params => {
      if (params['username']) {
        this.username = params['username'];
      } else {
        this.username = this.authService.getLoggedInUsername();
        this.editable = true;
      }

      if (this.username !== undefined) {
        this.client
          .getUserByUsername(this.username)
          .subscribe((result: User) => {
            this.user = result;

            if (this.user && this.user.additional_info && this.editor ) {
                this.editor.setValue(this.user.additional_info.description);
            }
          });
      }

      this.client
        .getMyMeetings(this.username)
        .subscribe((result: Meeting[]) => {
          const meeting_user_list = result;
          if (meeting_user_list) {
            for (const meeting_user of meeting_user_list) {
              this.client
                .getMeetingByMId(meeting_user.mid)
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

      this.client
        .getMeetingsFromAuthor(this.username)
        .subscribe((result: Meeting[]) => {
          result.forEach(meeting => {
            if (meeting) {
              if (meeting.courseOrEvent === 'course') {
                this.courses_from_author.push(meeting);
              } else {
                this.events_from_author.push(meeting);
              }
            }
          });
        });
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
