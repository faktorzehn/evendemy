import { Component, OnInit, ViewChild, Output, EventEmitter, Input, ElementRef } from '@angular/core';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

@Component({
  selector: 'evendemy-image-upload-dialog',
  templateUrl: './image-upload-dialog.component.html',
  styleUrls: ['./image-upload-dialog.component.scss']
})
export class ImageUploadDialogComponent implements OnInit {

  @Input()
  forMeeting = true;

  @Output()
  private data = new EventEmitter<any>();

  imageChangedEvent: any;
  croppedImage: any = '';
  ratio = 4/3;

  ngOnInit(): void {
    if (this.forMeeting) {
      this.ratio = 4/3;

      // this.cropperSettings.canvasWidth = 500;
      // this.cropperSettings.canvasHeight = 300;
      // this.cropperSettings.croppedWidth = 1600;
      // this.cropperSettings.croppedHeight = 1200;
      // this.cropperSettings.compressRatio = 10;
    } else {
      this.ratio = 1;

      // this.cropperSettings.canvasWidth = 500;
      // this.cropperSettings.canvasHeight = 300;
      // this.cropperSettings.croppedWidth = 500;
      // this.cropperSettings.croppedHeight = 500;
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

  apply() {
    this.data.emit(this.croppedImage);
  }

}
