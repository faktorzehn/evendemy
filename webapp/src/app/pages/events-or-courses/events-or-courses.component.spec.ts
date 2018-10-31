import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsOrCoursesComponent } from './events-or-courses.component';
import { Component, Input, Output } from '@angular/core';
import { EvendemyCheckboxComponent } from '../../components/checkbox/checkbox.component';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/observable/of';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { MeetingsService } from '../../services/meetings.service';
import { TagInputModule } from 'ngx-chips';
import { TagsService } from '../../services/tags.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MeetingUser } from '../../model/meeting_user';
import { AuthenticationServiceTestBuilder } from '../../test-utils/authentication-service-test-builder';
import { AuthenticationService } from '../../services/authentication.service';

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

    @Input()
    public attendedMeetingInformation: MeetingUser[] = [];

  }

  beforeEach(async(() => {
    const _meetingsSpy = jasmine.createSpyObj('MeetingsService', ['getAllMeetings']);
    const _routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const _storeSpy = jasmine.createSpyObj('Store', ['select']);
    const _tagsServiceSpy = jasmine.createSpyObj('TagsService', ['getAllTags']);

    const authServiceSpy = new AuthenticationServiceTestBuilder().username('').build();

    _storeSpy.select.and.returnValue(of([]));
    _tagsServiceSpy.getAllTags.and.returnValue(of([]));

    TestBed.configureTestingModule({
      declarations: [ EventsOrCoursesComponent, EvendemyMenuStubComponent,
      EvendemyCheckboxComponent, EvendemyMeetungListStubComponent],
      imports: [BrowserAnimationsModule, FormsModule, TagInputModule],
      providers: [{provide: MeetingsService, useValue: _meetingsSpy },
        {provide: ActivatedRoute,
        useValue: { params: of({type: 'course'}),
        queryParams: of({})
        }},
        {provide: Router, useValue: _routerSpy},
        {provide: Store, useValue: _storeSpy},
        {provide: TagsService, useValue: _tagsServiceSpy},
        {provide: AuthenticationService, useValue: authServiceSpy}
      ]
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

  it('should set default right', () => {
    fixture.detectChanges();
    expect(component.showNew).toBeTruthy();
    expect(component.showOld).toBeFalsy();
    expect(component.showNotAnnounced).toBeTruthy();
  });

  it('should redirect to error page', () => {
    activatedRoute.params = of({type: 'not-valid'});
    fixture.detectChanges();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/error']);
  });

  it('onShowNotAnnounced should change state to true', () => {
    component.showNotAnnounced = false;
    spyOn(component, 'changeQuery');
    component.onShowNotAnnounced(true);
    expect(component.showNotAnnounced).toBeTruthy();
    expect(component.changeQuery).toHaveBeenCalled();
  });

  it('onShowNotAnnounced should change state to false', () => {
    component.showNotAnnounced = true;
    spyOn(component, 'changeQuery');
    component.onShowNotAnnounced(false);
    expect(component.showNotAnnounced).toBeFalsy();
    expect(component.changeQuery).toHaveBeenCalled();
  });

  it('onShowNew should change state to true', () => {
    component.showNew = false;
    spyOn(component, 'changeQuery');
    component.onShowNew(true);
    expect(component.showNew).toBeTruthy();
    expect(component.changeQuery).toHaveBeenCalled();
  });

  it('onShowNew should change state to false', () => {
    component.showNew = true;
    spyOn(component, 'changeQuery');
    component.onShowNew(false);
    expect(component.showNew).toBeFalsy();
    expect(component.changeQuery).toHaveBeenCalled();
  });

  it('onShowOld should change state to true', () => {
    component.showOld = false;
    spyOn(component, 'changeQuery');
    component.onShowOld(true);
    expect(component.showOld).toBeTruthy();
    expect(component.changeQuery).toHaveBeenCalled();
  });

  it('onShowOld should change state to false', () => {
    component.showOld = true;
    spyOn(component, 'changeQuery');
    component.onShowOld(false);
    expect(component.showOld).toBeFalsy();
    expect(component.changeQuery).toHaveBeenCalled();
  });

});
