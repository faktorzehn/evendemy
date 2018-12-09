import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';
import { UsersService } from '../../services/users.service';
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
    private authService: AuthenticationService,
    private userService: UsersService) { }

  ngOnInit() {
    this.subscription = this.route.queryParams.subscribe(params => this.returnLink = params['return'] || '/meetings');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  login(username: string, password: string) {
    this.authService.loginUser(username, password).pipe(first()).subscribe((result) => {
      if (result === true) {

        // load users again - because first time (not logged in) will not be permitted
        try {
          this.userService.loadAllUsers().subscribe(res => res);
        } catch (e) { console.error(e); }

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
