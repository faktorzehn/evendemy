/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MeetingListComponent } from './meeting-list.component';
import { ConfigService } from '@ngx-config/core';
import { RouterTestingModule } from '@angular/router/testing';
import * as moment from 'moment';
import { Meeting } from '../../model/meeting';
import { Component, Input } from '@angular/core';


describe('MeetingListComponent', () => {
  let component: MeetingListComponent;
  let fixture: ComponentFixture<MeetingListComponent>;

  beforeEach(async(() => {
    const configSpy = jasmine.createSpyObj('ConfigService', ['getSettings']);
    configSpy.getSettings.and.returnValue({meeting_image_folder: 'folder'});

    @Component({selector: 'evendemy-tag', template: ''})
    class TagStubComponent {
      @Input() name: String;
    }

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      declarations: [MeetingListComponent, TagStubComponent],
      providers: [
        {provide: ConfigService, useValue: configSpy}]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getImage should create path', () => {
    expect(component.getImage(1)).toMatch(/folder\/1\.jpg/);
  });

  it('isMeetingNew should be true if today', () => {
    const meeting = new Meeting();
    meeting.creationDate = new Date();
    expect(component.isMeetingNew(meeting)).toBeTruthy();
  });

  it('isMeetingNew should be false if not today', () => {
    const meeting = new Meeting();
    meeting.creationDate = moment().add(1, 'd').toDate();
    expect(component.isMeetingNew(meeting)).toBeFalsy();
  });

});
