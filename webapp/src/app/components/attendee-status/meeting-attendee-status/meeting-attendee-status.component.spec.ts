import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAttendeeStatusComponent } from './meeting-attendee-status.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

describe('MeetingAttendeeStatusComponent', () => {
  let component: MeetingAttendeeStatusComponent;
  let fixture: ComponentFixture<MeetingAttendeeStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingAttendeeStatusComponent, ConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingAttendeeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
