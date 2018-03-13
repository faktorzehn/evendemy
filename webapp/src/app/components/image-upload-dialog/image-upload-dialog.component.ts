import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";

@Component({
  selector: 'app-image-upload-dialog',
  templateUrl: './image-upload-dialog.component.html',
  styleUrls: ['./image-upload-dialog.component.scss']
})
export class ImageUploadDialogComponent implements OnInit {

  ngOnInit(): void {
  }
  _data: any;
  cropperSettings: CropperSettings;

  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;

  @Output()
  private data = new EventEmitter<any>();

  constructor() {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 4;
    this.cropperSettings.height = 3;
    this.cropperSettings.canvasWidth = 500;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.croppedWidth = 800;
    this.cropperSettings.croppedHeight = 600;
    this._data = {};
  }

  fileChangeListener($event) {
    var image: any = new Image();
    var file: File = $event.target.files[0];
    var myReader: FileReader = new FileReader();
    var that = this;
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
