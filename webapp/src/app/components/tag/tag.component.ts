import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'evendemy-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {

  @Input() name: string;
  constructor() { }

  ngOnInit() {
  }

}
