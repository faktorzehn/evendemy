import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as Quill from 'quill';

@Component({
  selector: 'evendemy-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  @Input() value: String = '';
  @Input() editable = false;
  @Input() headlines = true;
  @Output() change = new EventEmitter<string>();

  quill: any;

  constructor() {
  }

  ngOnInit() {
    if (this.editable) {
      let headlineOptions = [2, 3, 4, false];

      if (!this.headlines) {
        headlineOptions = [false];
      }

      this.quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': headlineOptions}],
            ['bold', 'italic', 'underline', 'strike'],
            ['link'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['code-block'],
            ['clean']
          ]
        }
      });

      this.quill.on('text-change', (delta, oldDelta, source) => {
        if (source === 'user') {
          this.change.emit(this.getValue());
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
