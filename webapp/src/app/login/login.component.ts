import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from './../middleware/client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

     constructor(private router: Router, private client: Client) { }

     ngOnInit() {
     }

     login(username: string, password: string) {
          this.client.loginUser(username, password).subscribe( (result) => {
                if (result === true) {
                    // login successful
                    this.router.navigate(['/meeting-list/course']);
                }
          });
     }

}
