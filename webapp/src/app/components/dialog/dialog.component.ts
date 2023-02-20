import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DialogService } from '../../core/services/dialog.service';

@Component({
  selector: 'evendemy-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, OnDestroy {

  @Input() id = '';
  @Input() closeButton = true;
  @Input() closable = true;

  @Input() size: 'small'|'medium'|'large' = 'small';

  visible = false;

  constructor(private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.dialogService.register(this);
  }

  ngOnDestroy(): void {
    this.dialogService.unregister(this);
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  onClose(event?: any) {
    this.dialogService.hide(this.id);
  }

}
