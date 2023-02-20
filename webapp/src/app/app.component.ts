import { Component } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { animate, AnimationControls } from "motion";
import { ConfigService } from './services/config.service';
import packageJson from '../../package.json';
@Component({
  selector: 'evendemy-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  showNavbar = true;
  showSidebar = false;

  animation: AnimationControls;
  firstTime = true;

  usageNotices = '';
  version='';

  constructor(private router: Router, configService: ConfigService<any>) {
    this.usageNotices = configService.config.usage_notice;
    this.version = packageJson.version;
  }

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = true;
        if(event.url.includes('login')) {
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
