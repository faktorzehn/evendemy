import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Event} from '@angular/router';
import { Client } from './../middleware/client';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  sub: any;
  type: string;

  constructor(private route: ActivatedRoute, private client: Client) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.type = params['type'];
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onLogout() {
    this.client.logoutUser();
  }
}
