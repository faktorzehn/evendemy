import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsOrCoursesComponent } from './events-or-courses.component';
import { Component, Input } from '@angular/core';
import { EvendemyCheckboxComponent } from '../../components/checkbox/checkbox.component';
import { FormsModule } from '@angular/forms';
import { MeetingService } from '../../services/meeting.service';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/observable/of';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { MeetingsService } from '../../services/meetings.service.';

describe('EventsOrCoursesComponent', () => {
  let component: EventsOrCoursesComponent;
  let fixture: ComponentFixture<EventsOrCoursesComponent>;
  let activatedRoute;
  let routerSpy;

  @Component({selector: 'evendemy-menu', template: ''})
  class EvendemyMenuStubComponent {
  }

  @Component({selector: 'evendemy-meeting-list', template: ''})
  class EvendemyMeetungListStubComponent {
    @Input()
    meetings: any[];
  }

  beforeEach(async(() => {
    const _meetingsSpy = jasmine.createSpyObj('MeetingsService', ['getAllMeetings']);
    const _routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const _storeSpy = jasmine.createSpyObj('Store', ['select']);
    _storeSpy.select.and.returnValue(of([]));

    TestBed.configureTestingModule({
      declarations: [ EventsOrCoursesComponent, EvendemyMenuStubComponent, EvendemyCheckboxComponent, EvendemyMeetungListStubComponent ],
      imports: [FormsModule],
      providers: [{provide: MeetingsService, useValue: _meetingsSpy }, {provide: ActivatedRoute,
        useValue: { params: of({type: 'course'})}}, {provide: Router, useValue: _routerSpy}, {provide: Store, useValue: _storeSpy}]
    });
    activatedRoute = TestBed.get(ActivatedRoute);
    routerSpy = TestBed.get(Router);
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsOrCoursesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    spyOn(component, 'loadMeetings');
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.loadMeetings).toHaveBeenCalled();
  });

  it('should redirect to error page', () => {
    activatedRoute.params = of({type: 'not-valid'});
    fixture.detectChanges();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/error']);
  });

  it('onShowNotAnnounced should change state to true', () => {
    component.showNotAnnounced = false;
    spyOn(component, 'loadMeetings');
    component.onShowNotAnnounced(true);
    expect(component.showNotAnnounced).toBeTruthy();
    expect(component.loadMeetings).toHaveBeenCalled();
  });

  it('onShowNotAnnounced should change state to false', () => {
    component.showNotAnnounced = true;
    spyOn(component, 'loadMeetings');
    component.onShowNotAnnounced(false);
    expect(component.showNotAnnounced).toBeFalsy();
    expect(component.loadMeetings).toHaveBeenCalled();
  });

  it('onShowNew should change state to true', () => {
    component.showNew = false;
    spyOn(component, 'loadMeetings');
    component.onShowNew(true);
    expect(component.showNew).toBeTruthy();
    expect(component.loadMeetings).toHaveBeenCalled();
  });

  it('onShowNew should change state to false', () => {
    component.showNew = true;
    spyOn(component, 'loadMeetings');
    component.onShowNew(false);
    expect(component.showNew).toBeFalsy();
    expect(component.loadMeetings).toHaveBeenCalled();
  });

  it('onShowOld should change state to true', () => {
    component.showOld = false;
    spyOn(component, 'loadMeetings');
    component.onShowOld(true);
    expect(component.showOld).toBeTruthy();
    expect(component.loadMeetings).toHaveBeenCalled();
  });

  it('onShowOld should change state to false', () => {
    component.showOld = true;
    spyOn(component, 'loadMeetings');
    component.onShowOld(false);
    expect(component.showOld).toBeFalsy();
    expect(component.loadMeetings).toHaveBeenCalled();
  });
});
