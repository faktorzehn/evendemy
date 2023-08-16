import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { User } from '../../model/user';
import { Comment } from '../../model/comment';
import { AuthenticationService } from '../../services/authentication.service';
import { BaseComponent } from '../base/base.component';
import { UsersStore } from '../../core/store/user.store';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'evendemy-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent extends BaseComponent {

  @Input()
  comments: any[] = [];

  @Output()
  addComment = new EventEmitter<Comment>();
  
  users: User[] = [];
  commentbox = '';
  profile: KeycloakProfile | null = null;

  constructor(private authService: AuthenticationService, private keycloakService: KeycloakService, usersStore: UsersStore) { 
    super();
    this.addSubscription(usersStore.users().subscribe(users => this.users=users));
    this.keycloakService.loadUserProfile().then()
  }

  getUser(username: string) {
    const res = this.users.find( user => user.username === username);
    return res ? res : undefined;
  }

  onAddComment() {
    const comment = new Comment();
    comment.author = this.profile.username;
    comment.text = this.commentbox;

    this.addComment.emit(comment);

    this.commentbox = '';
  }

}
