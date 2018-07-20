/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UserInfoComponent } from './pages/user-info/user-info.component';
import { FooterComponent } from './components/footer/footer.component';
import { UsersService } from './services/users.service';

describe('AppComponent', () => {

  let usersServiceSpy: jasmine.SpyObj<UsersService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('UsersService', ['loadAllUsers']);

    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        FooterComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: UsersService , useValue: spy }
      ]
    });
    usersServiceSpy = TestBed.get(UsersService);
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    expect(usersServiceSpy.loadAllUsers.calls.count()).toBe(1, 'userService was called once');
    expect(app).toBeTruthy();
  }));

});
