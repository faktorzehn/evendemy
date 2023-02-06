import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'evendemy-base',
  template: ''
})
export class BaseComponent implements OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor() { }

  addSubscription(s: Subscription) {
    this.subscriptions.push(s);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
