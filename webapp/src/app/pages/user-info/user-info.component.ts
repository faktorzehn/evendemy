import { Component, OnInit } from '@angular/core';
import { Client } from '../../middleware/client';
import { User } from '../../model/user';
import { MeetingUser } from '../../model/meeting_user';
import { Meeting } from '../../model/meeting';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
     username: string;
     user: User;
     greeting = '...';
     private possibleGreetings = [
       'Welcome back USER',
       'Hi USER',
       'Nice to see you, USER',
       'Hello USER',
     ];
     courses: Meeting[] = [];
     events: Meeting[] = [];

     constructor(private client: Client) {
     }

     ngOnInit() {
          this.username = this.client.getLoggedInUsername();

          if (this.username !== undefined) {
               this.client.getUserByUsername(this.username).subscribe( (result) => {
                    this.user = result;
                    const random = Math.floor(Math.random() * (this.possibleGreetings.length));
                    this.greeting = this.possibleGreetings[random].replace('USER', this.user.firstname);
               });
          }

          this.client.getMyMeetings(this.client.getLoggedInUsername()).subscribe( (result) => {
            const meeting_user_list = result;
            if (meeting_user_list) {
              for (const meeting_user of meeting_user_list){
                this.client.getMeetingByMId(meeting_user.mid).subscribe((meeting_result) => {
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

     }

}
