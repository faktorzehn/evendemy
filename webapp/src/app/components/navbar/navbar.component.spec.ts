/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../model/user';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Input } from '@angular/core';
import { UserService } from '../../services/user.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService;

  beforeEach(async(() => {
    const userServiceMock = jasmine.createSpyObj('UserSerive', ['getUserByUsername']);
    userServiceMock.getUserByUsername.and.returnValue(of(new User('john')));

    const authServiceMock = jasmine.createSpyObj('authService', ['getLoggedInUsername', 'logoutUser']);
    authServiceMock.getLoggedInUsername.and.returnValue('john');

    const router = jasmine.createSpyObj('Router', ['navigate']);

    @Component({selector: 'evendemy-user-image', template: ''})
    class UserImageStubComponent {
      @Input() username: String;
    }

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      declarations: [NavbarComponent, UserImageStubComponent],
      providers: [
        {provide: ActivatedRoute, useValue: { params: of({type: 'course'})}},
        {provide: UserService, useValue: userServiceMock},
        {provide: AuthenticationService, useValue: authServiceMock}
      ]
    }).compileComponents();

    authService = TestBed.get(AuthenticationService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load user', () => {
    expect(component).toBeTruthy();
    expect(component.user.username).toBe('john');
  });

  it('should logout user', () => {
    component.onLogout();
    expect(authService.logoutUser).toHaveBeenCalled();
  });
});
