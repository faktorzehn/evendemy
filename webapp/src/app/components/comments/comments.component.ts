import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { User } from '../../model/user';
import { Comment } from '../../model/comment';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'evendemy-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  @Input()
  comments: any[] = [];

  @Input()
  users: User[] = [];

  @Output()
  addComment = new EventEmitter<Comment>();

  commentbox = '';

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
  }

  getUser(username: string) {
    const res = this.users.find( user => user.username === username);
    return res ? res : username;
  }

  onAddComment() {
    const comment = new Comment();
    comment.author = this.authService.getLoggedInUsername();
    comment.text = this.commentbox;

    this.addComment.emit(comment);

    this.commentbox = '';
  }

}
