import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Client } from './../middleware/client';

@Injectable()
export class LoggedInGuardService implements CanActivate {
  constructor(private router: Router, private client: Client) {
  }

  checkPermission() {
    return this.client.isLoggedIn();
  }

  canActivate() {
      if (this.checkPermission()) {
          // logged in so return true
          return true;
      }

      // not logged in so redirect to login page
      this.router.navigate(['/login']);
      return false;
  }
}
