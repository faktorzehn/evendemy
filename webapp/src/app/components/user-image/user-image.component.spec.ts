import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserImageComponent } from './user-image.component';
import { ConfigService } from '@ngx-config/core';
import { Client } from '../../middleware/client';
import { of } from 'rxjs';

describe('PageComponent', () => {
  let component: UserImageComponent;
  let fixture: ComponentFixture<UserImageComponent>;
  let clientSpy;

  beforeEach(async(() => {
    const _clientSpy = jasmine.createSpyObj('Client', ['getUserByUsername']);
    const configSpy = jasmine.createSpyObj('ConfigService', ['getSettings']);
    _clientSpy.getUserByUsername.and.callFake(username => {
      if (username === 'max') {
        return of({
          username: 'max',
          firstname: 'Max',
          lastname: 'Admin'
        });
      }
      return of({
        username: 'john',
        firstname: 'John',
        lastname: 'Doe'
      });
    });
    configSpy.getSettings.and.returnValue({
      user_image_folder: ''
    });

    TestBed.configureTestingModule({
      declarations: [UserImageComponent],
      providers: [
        { provide: Client, useValue: _clientSpy },
        { provide: ConfigService, useValue: configSpy }
      ]
    });
    clientSpy = TestBed.get(Client);
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setting username should trigger Client service to find user', () => {
    component.username = 'john';
    expect(clientSpy.getUserByUsername.calls.count()).toBe(
      1,
      'client was called once'
    );
  });

  it('get initials', () => {
    component.username = 'john';
    expect(component.initials).toBe('JD');
  });

  it('get initials without user', () => {
    expect(component.initials).toBe('');
  });

  it('get background color for John Doe', () => {
    component.username = 'john';
    expect(component.background_color).toBe('#8375b5');
  });

  it('get background color for Max Mustermann', () => {
    component.username = 'max';
    expect(component.background_color).toBe('#5da5e2');
  });
});
