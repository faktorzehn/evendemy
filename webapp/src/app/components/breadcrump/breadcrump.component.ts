import { Component, Input, OnInit } from '@angular/core';

export class Step {
  href?: string;
  title: string;
}

@Component({
  selector: 'evendemy-breadcrump',
  templateUrl: './breadcrump.component.html',
  styleUrls: ['./breadcrump.component.scss']
})
export class BreadcrumpComponent implements OnInit {

  @Input()
  steps: Step[] = [];

  constructor() { }

  ngOnInit() {
  }

}
