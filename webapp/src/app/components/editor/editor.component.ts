import { Component, OnInit, Input } from '@angular/core';
import * as Quill from 'quill';

@Component({
  selector: 'evendemy-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  @Input() value: String = '';
  @Input() editable: false;

  quill: any;

  constructor() {
  }

  ngOnInit() {
    if (this.editable) {
      this.quill = new Quill('#editor', {
        theme: 'snow',
        modules:{
          toolbar: [
            [{ 'header': [2, 3, 4, false]}],
            ['bold', 'italic', 'underline', 'strike'],
            ['link'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['code-block'],
            ['clean']
          ]
        }
      });
    }
    if (!this.value) {
      this.value = '';
    }
    this.setValue(this.value);
  }

  public getValue() {
    if (this.editable && this.quill) {
      return this.quill.root.innerHTML;
    }
    return this.value;
  }

  public setValue(value: String) {
    this.value = value;
    if (this.editable && this.quill) {
      this.quill.root.innerHTML = value;
      this.quill.update();
    }
  }

}
