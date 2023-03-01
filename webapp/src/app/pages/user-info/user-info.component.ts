import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
import { BaseComponent } from '../../components/base/base.component';
import { DialogService } from '../../core/services/dialog.service';
import { Meeting } from '../../model/meeting';
import { User } from '../../model/user';
import { AuthenticationService } from '../../services/authentication.service';
import { MeetingsService } from '../../services/meetings.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'evendemy-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent extends BaseComponent{

  contexMenuIsOpen = false;
  editMode = false;
  isEditable = true;
  username = '';
  user?: User;
  createMeetings: Meeting[] = [];
  attendedMeetings: Meeting[] = [];
  editorContent = "";
  img: any;

  form = this.fb.group({
    jobTitle: '',
  })

  constructor(    
    private authService: AuthenticationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private meetingsService: MeetingsService,
    private fb: FormBuilder,
    private dialogService: DialogService
    ) { 
    super();
    this.route.params.pipe(first()).subscribe(params => {
      if (params['username']) {
        this.username = params['username'];
        this.isEditable = this.username === this.authService.getLoggedInUsername();
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

  changePicture() {
    this.dialogService.show('image-upload');
  }

  openDeletePictureDialog() {
    this.dialogService.show('delete-image');
  }

  deletePicture() {
    this.userService.deleteImage(this.username).pipe(first()).subscribe( _ => {
      window.location.reload();
    });
    this.closeDialog('delete-image');
  }

  closeDialog(id: string) {
    this.dialogService.hide(id);
  }

  getImageDataFromDialog(img: any) {
    this.userService.addImage(this.username, {
      data: img
    }).pipe(first()).subscribe( _ => {
      window.location.reload();
    });
    this.closeDialog('image-upload');
  }

  closeContextMenu() {
    this.contexMenuIsOpen = false;
  }


}
