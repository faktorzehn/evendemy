import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'evendemy-editable-text',
  templateUrl: './editable-text.component.html',
  styleUrls: ['./editable-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: EditableTextComponent
    }
  ]
})
export class EditableTextComponent implements ControlValueAccessor {

  @Input() 
  placeholder = '';

  @Input()
  editable = false;

  edit = false;
  ignoreFirstClick= false;

  onChange = (val) => {};
  onTouch = (val) => {};

  @ViewChild('input') inputRef: ElementRef<HTMLInputElement>;;

  private _value?: string;
  get value() {
    return this._value;
  }
  set value(val: string){
    this._value = val
    this.onChange(val)
    this.onTouch(val)
  }

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

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
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
