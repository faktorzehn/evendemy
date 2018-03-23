import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Client } from './../middleware/client';

@Injectable()
export class LoggedInGuardService implements CanActivate {
  constructor(private router: Router, private client: Client) {
  }

  checkPermission() {
    return this.client.isLoggedIn();
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
