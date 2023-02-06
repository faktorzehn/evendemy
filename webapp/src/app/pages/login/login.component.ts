import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'evendemy-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private returnLink = '';
  public invalidLogin = false;
  private subscription: Subscription;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService) { }

  ngOnInit() {
    this.subscription = this.route.queryParams.subscribe(params => this.returnLink = params['return'] || '/meetings');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  login(username: string, password: string) {
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
