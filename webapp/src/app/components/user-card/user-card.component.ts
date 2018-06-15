import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../model/user';

@Component({
  selector: 'evendemy-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  @Input()
  user: User;

  constructor() { }

  ngOnInit(): void {
  }

}
