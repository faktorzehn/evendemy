import { Component } from '@angular/core';
import { BaseComponent } from '../../components/base/base.component';
import { UsersStore } from '../../core/store/user.store';
import { User } from '../../model/user';

@Component({
  selector: 'evendemy-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BaseComponent {

  users: User[] = [];

  constructor(usersStore: UsersStore) { 
    super();
    this.addSubscription(usersStore.users().subscribe( users => this.users=users));
  }

}
