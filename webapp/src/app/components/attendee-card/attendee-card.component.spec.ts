import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { User } from '../../model/user';
import { AttendeeCardComponent } from './attendee-card.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AttendeeCardComponent', () => {
  let component: AttendeeCardComponent;
  let fixture: ComponentFixture<AttendeeCardComponent>;
  const LABEL = 'XYZ';

  @Component({selector: 'evendemy-user-image', template: ''})
  class UserImageStubComponent {
    @Input() username: String;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ AttendeeCardComponent, UserImageStubComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendeeCardComponent);
    component = fixture.componentInstance;
  });

  function getTitle() {
    return fixture.nativeElement.querySelector('.meeting-title');
  }

  function getThumbnail() {
    return fixture.nativeElement.querySelector('.thumbnail');
  }

  function getMeetingTag() {
    return fixture.nativeElement.querySelector('.meeting-tag');
  }

  function getButton() {
    return fixture.nativeElement.querySelector('.btn');
  }

  function getAttendeeAdditionalBadge() {
    return fixture.nativeElement.querySelector('.attendee-additional-badge');
  }

  function getAttendeeAdditionalBadgeLabel() {
    return fixture.nativeElement.querySelector('.attendee-additional-badge-label');
  }

  it('should create', () => {
    component.user = new User('john', 'mail', 'john', 'doe');
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should display user', () => {
    component.user = new User('john', 'mail', 'John', 'Doe');
    fixture.detectChanges();

    const title: HTMLElement = getTitle();
    expect(title.textContent).toBe('John Doe');
  });

  it('should display small version', () => {
    component.user = new User('john', 'mail', 'John', 'Doe');
    component.small = true;
    fixture.detectChanges();

    const thumbnail: HTMLElement = getThumbnail();
    expect(thumbnail.classList).toContain('thumbnail-small');
  });

  it('should display not small version', () => {
    component.user = new User('john', 'mail', 'John', 'Doe');
    component.small = false;
    fixture.detectChanges();

    const thumbnail: HTMLElement = getThumbnail();
    expect(thumbnail.classList).not.toContain('thumbnail-small');
  });

  it('should display took part tag', () => {
    component.user = new User('john', 'mail', 'John', 'Doe');
    component.tookPart = true;
    fixture.detectChanges();

    const tag: HTMLElement = getMeetingTag();
    expect(tag).toBeDefined();
  });

  it('should not display took part tag', () => {
    component.user = new User('john', 'mail', 'John', 'Doe');
    component.tookPart = false;
    fixture.detectChanges();

    const tag: HTMLElement = getMeetingTag();
    expect(tag).toBeNull();
  });

  it('should display take part button', () => {
    component.user = new User('john', 'mail', 'John', 'Doe');
    component.showTakePartButton = true;
    fixture.detectChanges();

    const button: HTMLElement = getButton();
    expect(button).toBeDefined();
  });

  it('should not display take part button', () => {
    component.user = new User('john', 'mail', 'John', 'Doe');
    component.showTakePartButton = false;
    fixture.detectChanges();

    const button: HTMLElement = getButton();
    expect(button).toBeNull();
  });

  it('should display disabled take part button', () => {
    component.user = new User('john', 'mail', 'John', 'Doe');
    component.showTakePartButton = true;
    component.disableTakePartButton = true;
    fixture.detectChanges();

    const button = getButton();
    expect(button.disabled).toBeTruthy();
  });

  it('should display not disabled take part button', () => {
    component.user = new User('john', 'mail', 'John', 'Doe');
    component.showTakePartButton = true;
    component.disableTakePartButton = false;
    fixture.detectChanges();

    const button = getButton();
    expect(button.disabled).toBeFalsy();
  });

  it('should display attendee-additional-badge', () => {
    component.user = new User('john', 'mail', 'John', 'Doe');
    component.additionalAttendee = 'Johns best friend';
    fixture.detectChanges();

    const badge = getAttendeeAdditionalBadge();
    const label: HTMLElement = getAttendeeAdditionalBadgeLabel();
    expect(badge).toBeDefined();
    expect(label).toBeDefined();
    expect(label.textContent).toBe('Johns best friend');
  });

  it('should not display any attendee-additional-badge if null', () => {
    component.user = new User('john', 'mail', 'John', 'Doe');
    component.additionalAttendee = null;
    fixture.detectChanges();

    const badge = getAttendeeAdditionalBadge();
    expect(badge).toBeNull();
  });

  it('should emit if clicked', () => {
    const user = new User('john', 'mail', 'John', 'Doe');
    component.user = user;
    component.showTakePartButton = true;
    spyOn(component.tookPartClicked, 'emit');
    fixture.detectChanges();

    const button: HTMLElement = getButton();
    button.dispatchEvent(new Event('click'));
    expect(component.tookPartClicked.emit).toHaveBeenCalledWith(user);
  });

});
