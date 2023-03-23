import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../../components/base/base.component';

@Component({
  selector: 'evendemy-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent {

  private returnLink = '';
  public invalidLogin = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService) { 
      super();
      this.addSubscription(this.route.queryParams.subscribe(params => this.returnLink = params['return'] || '/meetings'));
  }

  login(username: string, password: string) {
    this.invalidLogin = false;
    this.authService.loginUser(username, password).pipe(first()).subscribe((result) => {
      if (result === true) {
        // login successful
        this.router.navigate([this.returnLink]);
      } else {
        this.invalidLogin = true;
      }
    }, error => {
      console.error(error);
      this.invalidLogin = true;
    });
  }
}
