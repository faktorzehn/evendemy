import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'evendemy-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  @Input()
  public title = '';

  @Input()
  public dialogID = '';

  @Output()
  public confirm: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  confirmWasClicked() {
    this.confirm.emit();
  }

}
