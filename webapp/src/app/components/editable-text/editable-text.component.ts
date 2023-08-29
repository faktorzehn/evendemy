import { Component, ElementRef, HostListener, Inject, Injector, Input, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';

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
export class EditableTextComponent implements OnInit, ControlValueAccessor {

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

  private controll: NgControl;

  constructor(
    private elementRef: ElementRef, 
    @Inject(Injector) private injector: Injector) {
  }

  ngOnInit(): void {
    this.controll = this.injector.get(NgControl);
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
    this.editable = !isDisabled;
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

  get invalid(): boolean {
    return this.controll.invalid;
  }

}
