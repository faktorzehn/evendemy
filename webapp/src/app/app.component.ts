import { Component } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { UsersService } from './services/users.service';
import { animate, AnimationControls } from "motion";
@Component({
  selector: 'evendemy-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  showNavbar = true;
  showSidebar = false;

  animation: AnimationControls;
  firstTime = true;

  constructor(userService: UsersService, private router: Router) {
    try {
      userService.loadAllUsers().subscribe( res => res);
    } catch (e) {}
  }

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = true;
        if(event.url === '/login') {
          this.showNavbar = false;
        }
      }
    });
    this.animation = animate('#sidebar', {
      left: ['-200px', 0]
    });
    this.animation.stop();
  }

  onMenuClick() {
    this.showSidebar = !this.showSidebar;

    if(this.showSidebar){
      if(!this.firstTime){
        this.animation.reverse();
      } else {
        this.animation.play();
      }
    } else {
      this.animation.reverse();
    }

    this.firstTime = false;
  }
}
