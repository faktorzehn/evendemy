import { Component, OnInit, Input } from '@angular/core';
import { ConfigService } from '@ngx-config/core';
import { Client } from '../../middleware/client';

@Component({
  selector: 'app-user-image',
  templateUrl: './user-image.component.html',
  styleUrls: ['./user-image.component.scss']
})
export class UserImageComponent implements OnInit {

  @Input()
  username = this.client.getLoggedInUsername();

  folder = this.config.getSettings().user_image_folder;

  constructor( private config: ConfigService, private client: Client) { }

  ngOnInit() {
  }

}
