import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Client } from './../../middleware/client';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private returnLink = '';
  private invalidLogin = false;

  constructor(private router: Router, private route: ActivatedRoute, private client: Client, private userService: UsersService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => this.returnLink = params['return'] || '/meeting-list/course');
  }

  login(username: string, password: string) {
    this.client.loginUser(username, password).subscribe((result) => {
      if (result === true) {

        //load users again - because first time (not logged in) will not be permitted
        try {
          this.userService.loadAllUsers().subscribe(res => res);
        } catch (e) { console.error(e); }

        // login successful
        this.router.navigate([this.returnLink]);
      }else{
        this.invalidLogin = true;
      }
    }, error => {
      console.error(error);
      this.invalidLogin = true;
    });
  }

}
