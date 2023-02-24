import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseComponent } from '../../components/base/base.component';
import { DialogService } from '../../core/services/dialog.service';
import { User } from '../../model/user';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'evendemy-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends BaseComponent{

  form = this.fb.group({
    'meetings_visible': 'true'
  });

  user?: User;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private authService: AuthenticationService,
    private dialogService: DialogService) { 
    super();
    this.addSubscription(userService.getUserByUsername(this.authService.getLoggedInUsername()).subscribe( user => {
      this.user = user;
      this.setForm(this.user);
    }));
  }

  setForm(user: User) {
    this.form.get('meetings_visible').setValue(this.user.options.summary_of_meetings_visible);
  }

  onSave() {
    this.addSubscription(this.userService.updateSettings(this.user.username, {
      additional_info_visible: true,
      summary_of_meetings_visible: this.form.get('meetings_visible').value
    }).subscribe( () => {
      this.dialogService.show('success-dialog');
    }));
  }

  closeDialog() {
    this.dialogService.hide('success-dialog');
  }

}
