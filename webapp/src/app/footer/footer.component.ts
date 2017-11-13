import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment.prod';
declare var require: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  version = 'NO VERSION FOUND';

  constructor() { }

  ngOnInit() {
    this.version = require('../../../package.json').version;
  }

}
