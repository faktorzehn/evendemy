import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ConfigService } from '@ngx-config/core';
import { User } from '../../model/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'evendemy-user-image',
  templateUrl: './user-image.component.html',
  styleUrls: ['./user-image.component.scss']
})
export class UserImageComponent implements OnInit, OnChanges {
  @Input() username: string;
  @Input() width: number;
  @Input() height: number;

  error = false;
  folder = this.config.getSettings().user_image_folder;
  user: User;
  palette = ['#5da5e2', '#e87f7f', '#f9d44c', '#c6e96e', '#8375b5'];

  constructor(
    private config: ConfigService,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.username) {
      this.userService
        .getUserByUsername(changes.username.currentValue)
        .subscribe((u: User) => (this.user = u));
    }
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
      const key = this.user.lastname[0].charCodeAt(0) + this.user.lastname[1].charCodeAt(0);
      return this.palette[key % 5];
    }
    return this.palette[0];
  }
}
