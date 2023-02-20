import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { DialogService } from '../../core/services/dialog.service';
import { User } from '../../model/user';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'evendemy-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  @Output() byMenuClick: EventEmitter<void> = new EventEmitter();

  sub: any;
  user: User;
  popupMenuIsOpen = false;

  constructor(private userService: UserService, private authService: AuthenticationService, private dialogService: DialogService) { }

  ngOnInit() {
    this.sub = this.userService.getUserByUsername( this.authService.getLoggedInUsername()).subscribe( (user: User) => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onLogout() {
    this.authService.logoutUser();
  }

  onBurgerMenuClick() {
    this.byMenuClick.emit();
  }

  showDialog() {
    this.dialogService.show('info-dialog');
  }
}
