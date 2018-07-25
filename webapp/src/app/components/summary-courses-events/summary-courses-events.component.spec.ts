/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryCoursesEventsComponent } from './summary-courses-events.component';

describe('SummaryCoursesEventsComponent', () => {
  let component: SummaryCoursesEventsComponent;
  let fixture: ComponentFixture<SummaryCoursesEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryCoursesEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryCoursesEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show  created and attended meetings', () => {
    component.numberOfCreatedMeetings = 10;
    component.numberOfAttendedMeetings = 20;
    fixture.detectChanges();

    const labelAttendedMeetings: HTMLElement = fixture.nativeElement.querySelector('.attended-meetings');
    const labelCreatedMeetings: HTMLElement = fixture.nativeElement.querySelector('.created-meetings');

    expect(labelAttendedMeetings.textContent.trim()).toBe('20');
    expect( labelCreatedMeetings.textContent.trim()).toBe('10');
  });
});
