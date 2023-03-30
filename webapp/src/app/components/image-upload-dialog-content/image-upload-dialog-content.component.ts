import { Component, OnInit, ViewChild, Output, EventEmitter, Input, ElementRef } from '@angular/core';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

@Component({
  selector: 'evendemy-image-upload-dialog-content',
  templateUrl: './image-upload-dialog-content.component.html',
  styleUrls: ['./image-upload-dialog-content.component.scss']
})
export class ImageUploadDialogContentComponent implements OnInit {

  @Input()forMeeting = true;
  
  @Output() byConfirm: EventEmitter<any> = new EventEmitter();
  @Output() byCancel: EventEmitter<void> = new EventEmitter();

  imageChangedEvent: any;
  croppedImage: any = '';
  ratio = 4/3;

  ngOnInit(): void {
    if (this.forMeeting) {
      this.ratio = 16/9;
    } else {
      this.ratio = 1;
    }
  }

  constructor() {
  }

  fileSelected($event) {
    this.imageChangedEvent  = $event;
  }

  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  }
  imageLoaded(image?: LoadedImage) {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }

  onConfirm() {
    this.byConfirm.emit(this.croppedImage);
  }

  onCancel() {
    this.byCancel.emit();
  }

}
