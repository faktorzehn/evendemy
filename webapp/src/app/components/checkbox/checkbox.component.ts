import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'evendemy-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class EvendemyCheckboxComponent implements OnInit {
  @Input()
  public value = false;

  @Input()
  public label = '';

  @Input()
  public disabled = false;

  @Output()
  public checkboxChanged: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onCheckboxChangeInternal() {
    this.checkboxChanged.emit(this.value);
  }

}
