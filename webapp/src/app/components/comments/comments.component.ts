import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { User } from '../../model/user';
import { Comment } from '../../model/comment';
import { AuthenticationService } from '../../services/authentication.service';
import { BaseComponent } from '../base/base.component';
import { UsersStore } from '../../core/store/user.store';

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

  constructor(private authService: AuthenticationService, usersStore: UsersStore) { 
    super();
    this.addSubscription(usersStore.users().subscribe(users => this.users=users));
  }

  getUser(username: string) {
    const res = this.users?.find( user => user.username === username);
    return res ? res : undefined;
  }

  onAddComment() {
    const comment = new Comment();
    comment.author = this.authService.getLoggedInUsername();
    comment.text = this.commentbox;

    this.addComment.emit(comment);

    this.commentbox = '';
  }

}
