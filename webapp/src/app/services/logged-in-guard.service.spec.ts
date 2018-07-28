import { LoggedInGuardService } from './logged-in-guard.service';
import { Router, RouterStateSnapshot } from '@angular/router';
import { Client } from '../middleware/client';

describe ('LoggedInGuardService', () => {

  let loggedInGuardService: LoggedInGuardService;
  let router;
  let client;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    client = jasmine.createSpyObj('Client', ['isLoggedIn']);
    loggedInGuardService = new LoggedInGuardService(router, client);
  });

  it('canActivate should allow access', () => {
    client.isLoggedIn.and.returnValue(true);
    expect(loggedInGuardService.canActivate(null, null)).toBeTruthy();
  });

  it('canActivate should not allow access', () => {
    client.isLoggedIn.and.returnValue(false);
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
