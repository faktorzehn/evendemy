import { LoggedInGuardService } from './logged-in-guard.service';
import { Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationServiceTestBuilder } from '../test-utils/authentication-service-test-builder';

describe ('LoggedInGuardService', () => {

  let loggedInGuardService: LoggedInGuardService;
  let router;
  let authService;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    authService = new AuthenticationServiceTestBuilder().isLoggedIn(true).build();
    loggedInGuardService = new LoggedInGuardService(router, authService);
  });

  it('canActivate should allow access', () => {
    authService.isLoggedIn.and.returnValue(true);
    expect(loggedInGuardService.canActivate(null, null)).toBeTruthy();
  });

  it('canActivate should not allow access', () => {
    authService.isLoggedIn.and.returnValue(false);
    const state: any = {
      url: 'XYZ'
    };
    expect(loggedInGuardService.canActivate(null, state)).toBeFalsy();
    expect(router.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: {
        return: state.url
      }
    });
  });

});
