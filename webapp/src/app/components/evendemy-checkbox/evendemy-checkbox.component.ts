import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-evendemy-checkbox',
  templateUrl: './evendemy-checkbox.component.html',
  styleUrls: ['./evendemy-checkbox.component.scss']
})
export class EvendemyCheckboxComponent implements OnInit {
  @Input()
  public value = false;

  @Input()
  public label = '';

  @Input()
  public disabled = false;

  @Output()
  public onCheckboxChange: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onCheckboxChangeInternal() {
    this.onCheckboxChange.emit(this.value);
  }

}
