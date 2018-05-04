import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Event} from '@angular/router';
import { Client } from './../../middleware/client';
import { User } from '../../model/user';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  sub: any;
  type: string;
  user: User;

  constructor(private route: ActivatedRoute, private client: Client) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.type = params['type'];
    });

    this.client.getUserByUsername( this.client.getLoggedInUsername()).subscribe( (user: User) => {
      this.user = user;
 });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onLogout() {
    this.client.logoutUser();
  }
}
