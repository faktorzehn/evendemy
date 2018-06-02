import { Component } from '@angular/core';
import { UsersService } from './services/users.service';

@Component({
  selector: 'evendemy-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(userService: UsersService) {
    try {
      userService.loadAllUsers().subscribe( res => res);
    } catch (e) {}
  }
}
