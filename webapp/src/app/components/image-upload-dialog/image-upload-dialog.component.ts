import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";

@Component({
  selector: 'app-image-upload-dialog',
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
      this.cropperSettings.croppedWidth = 800;
      this.cropperSettings.croppedHeight = 600;
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
