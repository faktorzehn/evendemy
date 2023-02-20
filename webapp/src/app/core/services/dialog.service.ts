import { Component, Injectable } from '@angular/core';
import { DialogComponent } from '../../components/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private dialogs: Map<string, DialogComponent> = new Map();

  constructor() { }

  register(d: DialogComponent) {
    this.dialogs.set(d.id, d);
  }

  unregister(d: DialogComponent) {
    if(this.dialogs.has(d.id)) {
      this.dialogs.delete(d.id);
    }
  }

  show(id: string) {
    var dialog = this.dialogs.get(id);
    if(dialog) {
      dialog.show();
    }
  }

  hide(id: string) {
    var dialog = this.dialogs.get(id);
    if(dialog) {
      dialog.hide();
    }
  }
}
