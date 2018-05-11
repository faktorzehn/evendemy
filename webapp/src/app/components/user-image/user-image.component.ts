import { Component, OnInit, Input } from '@angular/core';
import { ConfigService } from '@ngx-config/core';
import { Client } from '../../middleware/client';
import { User } from '../../model/user';
import { Store } from '@ngrx/store';
import { AppState } from '../../appState';

@Component({
  selector: 'app-user-image',
  templateUrl: './user-image.component.html',
  styleUrls: ['./user-image.component.scss']
})
export class UserImageComponent implements OnInit {

  @Input()
  username: string;
  @Input()
  width: number;
  @Input()
  height: number;

  error = false;
  folder = this.config.getSettings().user_image_folder;
  users: User[];
  user: User;

  constructor( private config: ConfigService, private client: Client, private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select('users').subscribe( res => this.users = res );
    this.username = this.client.getLoggedInUsername();
    this.client.getUserByUsername(this.username).subscribe((u: User) => this.user = u);
  }

  get initials() {
    let result = '';
    if (this.user) {
      result += this.user.firstname[0];
      result += this.user.lastname[0];
    }
    return result;
  }


}
