import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
import { BaseComponent } from '../../components/base/base.component';
import { Meeting } from '../../model/meeting';
import { User } from '../../model/user';
import { AuthenticationService } from '../../services/authentication.service';
import { MeetingsService } from '../../services/meetings.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'evendemy-user-info-new',
  templateUrl: './user-info-new.component.html',
  styleUrls: ['./user-info-new.component.scss']
})
export class UserInfoNewComponent extends BaseComponent{

  contexMenuIsOpen = false;
  editMode = false;
  isEditable = true;
  username = '';
  user?: User;
  createMeetings: Meeting[] = [];
  attendedMeetings: Meeting[] = [];
  editorContent = "";

  form = this.fb.group({
    jobTitle: '',
  })

  constructor(    
    private authService: AuthenticationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private meetingsService: MeetingsService,
    private fb: FormBuilder
    ) { 
    super();
    this.route.params.pipe(first()).subscribe(params => {
      if (params['username']) {
        this.username = params['username'];
      } else {
        this.username = this.authService.getLoggedInUsername();
        this.isEditable = true;
      }

      this.loadUser(this.username);
      this.loadCreatedMeetings(this.username);
      this.loadAttendedMeetings(this.username);
    });

  }
  
  loadUser(username: string) {
    this.addSubscription(this.userService.getUserByUsername(username).pipe(first()).subscribe(
      user => {
        this.user = user;
        this.setForm(this.user);
      }
    ));
  }
    
  loadCreatedMeetings(username: string) {
    this.addSubscription(this.meetingsService.getMeetingsFromAuthor(username).subscribe(
      meetings => this.createMeetings = meetings
    )); 
  }

  loadAttendedMeetings(username: string) {
    this.addSubscription(this.meetingsService.getMyConfirmedMeetings(username).subscribe(
      meetings => this.attendedMeetings = meetings
    )); 
  }

  setForm(user: User) {
    this.form.get('jobTitle').setValue(user?.additional_info?.job_title);
    this.editorContent = user?.additional_info?.description;
  }

  public editorChanged(text: string){
    this.editorContent = text;
  }

  onSave() {
    this.addSubscription(this.userService.updateAdditionalInfo(this.username, {
      job_title: this.form.get('jobTitle').value,
      description: this.editorContent,
    }).subscribe());
    this.editMode = false;
  }

  onCancel() {
    this.editMode = false;
    this.setForm(this.user);
  }


}
