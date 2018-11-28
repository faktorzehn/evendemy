import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaAttendeeStatusComponent } from './idea-attendee-status.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

describe('IdeaAttendeeStatusComponent', () => {
  let component: IdeaAttendeeStatusComponent;
  let fixture: ComponentFixture<IdeaAttendeeStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdeaAttendeeStatusComponent, ConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdeaAttendeeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
