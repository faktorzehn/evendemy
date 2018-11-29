import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Event} from '@angular/router';
import { User } from '../../model/user';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'evendemy-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  sub: any;
  user: User;

  constructor(private userService: UserService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.sub = this.userService.getUserByUsername( this.authService.getLoggedInUsername()).subscribe( (user: User) => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onLogout() {
    this.authService.logoutUser();
  }
}
