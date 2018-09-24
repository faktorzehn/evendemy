/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../model/user';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Input } from '@angular/core';
import { UserService } from '../../services/user.service';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let authService;

  beforeEach(async(() => {
    const userServiceMock = jasmine.createSpyObj('UserSerive', ['getUserByUsername']);
    userServiceMock.getUserByUsername.and.returnValue(of(new User('john')));

    const authServiceMock = jasmine.createSpyObj('authService', ['getLoggedInUsername', 'logoutUser']);
    authServiceMock.getLoggedInUsername.and.returnValue('john');

    @Component({selector: 'evendemy-user-image', template: ''})
    class UserImageStubComponent {
      @Input() username: String;
    }

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      declarations: [MenuComponent, UserImageStubComponent],
      providers: [
        {provide: ActivatedRoute, useValue: { params: of({type: 'course'})}},
        {provide: UserService, useValue: userServiceMock},
        {provide: AuthenticationService, useValue: authServiceMock}]
    }).compileComponents();

    authService = TestBed.get(AuthenticationService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load user', () => {
    expect(component).toBeTruthy();
    expect(component.user.username).toBe('john');
    expect(component.type).toBe('course');
  });

  it('should logout user', () => {
    component.onLogout();
    expect(authService.logoutUser).toHaveBeenCalled();
  });
});
