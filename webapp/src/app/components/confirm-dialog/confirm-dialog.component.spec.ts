/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set id', () => {
    component.dialogID = 'abc';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('#abc');
    expect(el).toBeDefined();
  });

  it('should set title', () => {
    component.title = 'abc';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('.modal-title');
    expect(el.textContent).toBe('abc');
  });

  it('should emit if confirm clicked', () => {
    const spy = spyOn(component.confirm, 'emit');
    const button: HTMLElement = fixture.nativeElement.querySelector('.confirm-button');
    button.dispatchEvent(new Event('click'));
    expect(component.confirm.emit).toHaveBeenCalled();
  });
});
