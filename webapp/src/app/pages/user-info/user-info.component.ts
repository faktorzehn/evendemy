import { Component, OnInit } from '@angular/core';
import { Client } from '../../middleware/client';
import { User } from '../../model/user';
import { MeetingUser } from '../../model/meeting_user';
import { Meeting } from '../../model/meeting';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-info',
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

     constructor(private client: Client, private userService: UserService, private route: ActivatedRoute) {
     }

     ngOnInit() {
      const subscribe = this.route.params.subscribe(params => {
        if (params['username']){
          this.username = params['username'];
        } else {
          this.username = this.client.getLoggedInUsername();
          this.editable = true;
        }

          if (this.username !== undefined) {
               this.client.getUserByUsername(this.username).subscribe( (result: User) => {
                    this.user = result;
               });
          }

          this.client.getMyMeetings(this.username).subscribe( (result: Meeting[]) => {
            const meeting_user_list = result;
            if (meeting_user_list) {
              for (const meeting_user of meeting_user_list){
                this.client.getMeetingByMId(meeting_user.mid).subscribe((meeting_result: Meeting) => {
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

          this.client.getMeetingsFromAuthor(this.username).subscribe( (result: Meeting[]) => {
            result.forEach( meeting => {
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
        username: this.client.getLoggedInUsername(),
        data: data.image
      }
      this.userService.addImage(this.client.getLoggedInUsername(), postData).subscribe((img_result) => {});
     }

     deleteImage() {
      this.userService.deleteImage(this.client.getLoggedInUsername()).subscribe((img_result) => {});
     }

     onUpdateSettings() {
      this.userService.updateSettings(this.client.getLoggedInUsername(), this.user.options).subscribe( o => {});
     }
}
