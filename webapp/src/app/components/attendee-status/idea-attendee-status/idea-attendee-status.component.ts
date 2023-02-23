import { Component } from '@angular/core';
import { DialogService } from '../../../core/services/dialog.service';
import { AbstractAttendeeStatusComponent } from '../attendee-status.component';

@Component({
  selector: 'evendemy-idea-attendee-status',
  templateUrl: './idea-attendee-status.component.html',
  styleUrls: ['./idea-attendee-status.component.scss']
})
export class IdeaAttendeeStatusComponent extends AbstractAttendeeStatusComponent {

  constructor(private dialogService: DialogService){
    super();
  }

  openDialog() {
    this.dialogService.show('idea-external-dialog');
  }

  closeDialog() {
    this.dialogService.hide('idea-external-dialog');
  }

  onAccept(name: string) {
    super.onAccept(name);
    this.closeDialog();
  }

}
