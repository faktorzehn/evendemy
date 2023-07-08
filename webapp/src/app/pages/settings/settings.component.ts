import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseComponent } from '../../components/base/base.component';
import { DialogService } from '../../core/services/dialog.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Settings } from '../../model/settings';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'evendemy-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends BaseComponent{

  form = this.fb.group({
    'meetings_visible': 'true'
  });

  settings?: Settings;

  constructor(
    private fb: FormBuilder, 
    private settingsService: SettingsService, 
    private authService: AuthenticationService,
    private dialogService: DialogService) { 
    super();
    this.addSubscription(settingsService.getSettings().subscribe( settings => {
      this.settings = settings;
      this.setForm();
    }));
  }

  setForm() {
    this.form.get('meetings_visible').setValue(this.settings.summary_of_meetings_visible+'');
  }

  onSave() {
    this.addSubscription(this.settingsService.updateSettings({
      summary_of_meetings_visible: (this.form.get('meetings_visible').value === 'true')
    }).subscribe( () => {
      this.dialogService.show('success-dialog');
    }));
  }

  closeDialog() {
    this.dialogService.hide('success-dialog');
  }

}
