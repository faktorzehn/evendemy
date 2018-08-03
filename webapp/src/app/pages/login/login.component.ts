import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'evendemy-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private returnLink = '';
  public invalidLogin = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private userService: UsersService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => this.returnLink = params['return'] || '/meeting-list/course');
  }

  login(username: string, password: string) {
    this.authService.loginUser(username, password).subscribe((result) => {
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
