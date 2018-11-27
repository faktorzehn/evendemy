import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeStatusComponent } from './attendee-status.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

describe('AttendeeStatusComponent', () => {
  let component: AttendeeStatusComponent;
  let fixture: ComponentFixture<AttendeeStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendeeStatusComponent, ConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendeeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
