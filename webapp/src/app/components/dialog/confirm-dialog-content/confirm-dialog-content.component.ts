import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'evendemy-confirm-dialog-content',
  templateUrl: './confirm-dialog-content.component.html',
  styleUrls: ['./confirm-dialog-content.component.scss']
})
export class ConfirmDialogContentComponent implements OnInit {

  @Output() byConfirm: EventEmitter<void> = new EventEmitter();
  @Output() byCancel: EventEmitter<void> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onConfirm() {
    this.byConfirm.emit();
  }

  onCancel() {
    this.byCancel.emit();
  }

}
