import { Component, OnInit, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { DialogService } from '../../core/services/dialog.service';
import { User } from '../../model/user';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'evendemy-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit, OnDestroy {

  @Output() byMenuClick: EventEmitter<void> = new EventEmitter();

  sub: any;
  user: User;
  popupMenuIsOpen = false;

  constructor(private userService: UserService, private authService: AuthenticationService, private dialogService: DialogService) { }

  ngAfterViewInit() {
    if(this.authService.getLoggedInUsername()){
      this.sub = this.userService.getUserByUsername(this.authService.getLoggedInUsername()).subscribe( (user: User) => {
        this.user = user;
      });
    }
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
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
