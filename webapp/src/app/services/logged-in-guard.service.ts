import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class LoggedInGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthenticationService) {
  }

  checkPermission() {
    return this.authService.isLoggedIn();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      if (this.checkPermission()) {
          // logged in so return true
          return true;
      }

      // not logged in so redirect to login page
      this.router.navigate(['/login'], {
        queryParams: {
          return: state.url
        }
      });
      return false;
  }
}
