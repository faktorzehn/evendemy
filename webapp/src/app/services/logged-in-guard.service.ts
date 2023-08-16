import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { windowCount } from 'rxjs';

@Injectable()
export class LoggedInGuardService extends KeycloakAuthGuard {
  constructor(protected router: Router, protected keycloakService: KeycloakService) {
    super(router,keycloakService);
  }

  async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) {
    if(!this.authenticated) {
      await this.keycloakService.login({
        redirectUri: window.location.origin + state.url
      });
      
      return this.authenticated;
    }
  }

}
