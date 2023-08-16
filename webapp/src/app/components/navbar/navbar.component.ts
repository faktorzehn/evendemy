import { Component, OnInit, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { DialogService } from '../../core/services/dialog.service';
import { User } from '../../model/user';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'evendemy-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnDestroy, OnInit {

  @Output() byMenuClick: EventEmitter<void> = new EventEmitter();

  sub: any;
  user: User;
  popupMenuIsOpen = false;

  constructor(private userService: UserService, private keycloakService: KeycloakService, private dialogService: DialogService) { }

  async ngOnInit() {
    const loggedIn = await this.keycloakService.isLoggedIn();
    
    if(loggedIn) {
      const profile = await this.keycloakService.loadUserProfile()
      this.userService.getUserByUsername(profile.username).subscribe( (user: User) => {
        this.user = user;
      })
    }
    /*
    if(this.authService.getLoggedInUsername()){
      this.sub = this.userService.getUserByUsername(this.authService.getLoggedInUsername()).subscribe( (user: User) => {
        this.user = user;
      });
    }
    */
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

  onLogout() {
    this.keycloakService.logout();
  }

  onBurgerMenuClick() {
    this.byMenuClick.emit();
  }

  showDialog() {
    this.dialogService.show('info-dialog');
  }
}
