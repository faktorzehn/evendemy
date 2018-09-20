import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Event} from '@angular/router';
import { Client } from '../../middleware/client';
import { User } from '../../model/user';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'evendemy-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  sub: any;
  type: string;
  user: User;

  constructor(private route: ActivatedRoute, private client: Client, private authService: AuthenticationService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.type = params['type'];
    });

    this.client.getUserByUsername( this.authService.getLoggedInUsername()).subscribe( (user: User) => {
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
