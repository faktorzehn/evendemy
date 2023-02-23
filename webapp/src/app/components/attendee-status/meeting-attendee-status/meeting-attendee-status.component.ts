import { Component } from '@angular/core';
import { DialogService } from '../../../core/services/dialog.service';
import { AbstractAttendeeStatusComponent } from '../attendee-status.component';

@Component({
  selector: 'evendemy-meeting-attendee-status',
  templateUrl: './meeting-attendee-status.component.html',
  styleUrls: ['./meeting-attendee-status.component.scss']
})
export class MeetingAttendeeStatusComponent extends AbstractAttendeeStatusComponent {
  
  constructor(private dialogService: DialogService){
    super();
  }

  openDialog() {
    this.dialogService.show('meeting-external-dialog');
  }

  closeDialog() {
    this.dialogService.hide('meeting-external-dialog');
  }

  onAccept(name: string) {
    super.onAccept(name);
    this.closeDialog();
  }
}
