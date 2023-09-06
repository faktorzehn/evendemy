import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class AuthenticationService {

  constructor(
    private keycloakService: KeycloakService
  ) {}

  public logoutUser() {
    this.keycloakService.logout('http://localhost:4200');
  }

  public getLoggedInUsername() {
    return this.keycloakService.getUsername();
  }

}
