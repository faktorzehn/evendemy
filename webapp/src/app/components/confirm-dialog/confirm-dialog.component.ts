import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'evendemy-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  @Input()
  private title = '';

  @Input()
  private dialog_id = '';

  @Output()
  private onConfirm: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  confirmWasClicked(){
    this.onConfirm.emit();
  }

}
