import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';

@Component({
  selector: 'evendemy-image-upload-dialog',
  templateUrl: './image-upload-dialog.component.html',
  styleUrls: ['./image-upload-dialog.component.scss']
})
export class ImageUploadDialogComponent implements OnInit {


  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;

  @Input()
  forMeeting = true;

  @Output()
  private data = new EventEmitter<any>();

  _data: any;
  cropperSettings: CropperSettings;

  ngOnInit(): void {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;

    if (this.forMeeting) {
      this.cropperSettings.width = 4;
      this.cropperSettings.height = 3;
      this.cropperSettings.canvasWidth = 500;
      this.cropperSettings.canvasHeight = 300;
      this.cropperSettings.croppedWidth = 1600;
      this.cropperSettings.croppedHeight = 1200;
      this.cropperSettings.compressRatio = 10;
    } else {
      this.cropperSettings.width = 1;
      this.cropperSettings.height = 1;
      this.cropperSettings.canvasWidth = 500;
      this.cropperSettings.canvasHeight = 300;
      this.cropperSettings.croppedWidth = 500;
      this.cropperSettings.croppedHeight = 500;
    }

    this._data = {};
  }

  constructor() {
  }

  fileChangeListener($event) {
    const image: any = new Image();
    const file: File = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    const that = this;
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);

    };

    myReader.readAsDataURL(file);
  }

  apply() {
    this.data.emit(this._data);
  }

}
