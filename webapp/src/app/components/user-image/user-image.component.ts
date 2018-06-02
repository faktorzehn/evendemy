import { Component, OnInit, Input } from "@angular/core";
import { ConfigService } from "@ngx-config/core";
import { Client } from "../../middleware/client";
import { User } from "../../model/user";
import { Store } from "@ngrx/store";
import { AppState } from "../../appState";

@Component({
  selector: "evendemy-user-image",
  templateUrl: './user-image.component.html',
  styleUrls: ['./user-image.component.scss']
})
export class UserImageComponent implements OnInit {
  @Input() username: string;
  @Input() width: number;
  @Input() height: number;

  error = false;
  folder = this.config.getSettings().user_image_folder;
  users: User[];
  user: User;
  palette = ['#5da5e2', '#e87f7f', '#f9d44c', '#c6e96e', '#8375b5'];

  constructor(
    private config: ConfigService,
    private client: Client,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.store.select('users').subscribe(res => (this.users = res));
    if (!this.username) {
      this.username = this.client.getLoggedInUsername();
    }
    this.client
      .getUserByUsername(this.username)
      .subscribe((u: User) => (this.user = u));
  }

  get initials() {
    let result = '';
    if (this.user) {
      result += this.user.firstname[0];
      result += this.user.lastname[0];
    }
    return result;
  }

  get color() {
    return 'white';
  }

  get background_color() {
    if (this.user) {
      const key = this.user.lastname[0].charCodeAt(0) + this.user.lastname[1].charCodeAt(0) + this.user.lastname[2].charCodeAt(0)+1;
      return this.palette[key % 5];
    }
    return this.palette[0];
  }
}
