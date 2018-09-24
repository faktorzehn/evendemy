import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserImageComponent } from './user-image.component';
import { ConfigService } from '@ngx-config/core';
import { of } from 'rxjs';
import { SimpleChange } from '@angular/core';
import { UserService } from '../../services/user.service';

describe('UserImageComponent', () => {
  let component: UserImageComponent;
  let fixture: ComponentFixture<UserImageComponent>;
  let userService;

  beforeEach(async(() => {
    const userServiceMock = jasmine.createSpyObj('UserService', ['getUserByUsername']);
    const configSpy = jasmine.createSpyObj('ConfigService', ['getSettings']);
    userServiceMock.getUserByUsername.and.callFake(username => {
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
        { provide: UserService, useValue: userServiceMock },
        { provide: ConfigService, useValue: configSpy }
      ]
    });
    userService = TestBed.get(UserService);
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
    component.ngOnChanges({
      username: new SimpleChange(null, 'john', true)
    });
    fixture.detectChanges();
    expect(userService.getUserByUsername.calls.count()).toBe(
      1,
      'client was called once'
    );
  });

  it('get initials', () => {
    component.ngOnChanges({
      username: new SimpleChange(null, 'john', true)
    });
    expect(component.initials).toBe('JD');
  });

  it('get initials without user', () => {
    expect(component.initials).toBe('');
  });

  it('get background color for John Doe', () => {
    component.ngOnChanges({
      username: new SimpleChange(null, 'john', true)
    });
    expect(component.background_color).toBe('#8375b5');
  });

  it('get background color for Max Mustermann', () => {
    component.ngOnChanges({
      username: new SimpleChange(null, 'max', true)
    });
    expect(component.background_color).toBe('#5da5e2');
  });
});
