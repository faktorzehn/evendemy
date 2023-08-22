import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'evendemy-editable-input',
  templateUrl: './editable-input.component.html',
  styleUrls: ['./editable-input.component.scss']
})
export class EditableInputComponent {

  @Input() 
  placeholder = '';

  @Input() 
  value = '';

  @Input()
  editable = false;

  @Input()
  invalid = false;

  edit = false;
  ignoreFirstClick= false;

  @ViewChild('input') inputRef: ElementRef<HTMLInputElement>;;

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event'])
  click(event) {
    if(this.edit && !this.ignoreFirstClick){
      if(this.elementRef.nativeElement.contains(event.target)) {
        console.log("clicked inside");
      } else {
        console.log("clicked outside");
        this.edit = false;
      }
    }
    if(this.ignoreFirstClick){
      this.ignoreFirstClick = false;
    }
  }

  onEdit() {
    if(this.editable) {
      this.edit = true;
      this.ignoreFirstClick = true;

      setTimeout(_ => {
      if(this.inputRef) {
        this.inputRef.nativeElement.focus();
      }});
    }
  }

  noValue(): boolean {
    return this.value === '' || !this.value;
  }

}
