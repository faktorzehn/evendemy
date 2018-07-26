/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUploadDialogComponent } from './image-upload-dialog.component';
import { ImageCropperComponent } from 'ngx-img-cropper';

describe('ImageUploadDialogComponent', () => {
  let component: ImageUploadDialogComponent;
  let fixture: ComponentFixture<ImageUploadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageUploadDialogComponent, ImageCropperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create dialog for meetings', () => {
    component.forMeeting = true;
    component.ngOnInit();
    expect(component.cropperSettings.width).toBe(4);
    expect(component.cropperSettings.height).toBe(3);
    expect(component.cropperSettings.canvasWidth).toBe(500);
    expect(component.cropperSettings.canvasHeight).toBe(300);
    expect(component.cropperSettings.croppedWidth).toBe(800);
    expect(component.cropperSettings.croppedHeight).toBe(600);
  });

  it('should create dialog for avatar icon', () => {
    component.forMeeting = false;
    component.ngOnInit();
    expect(component.cropperSettings.width).toBe(1);
    expect(component.cropperSettings.height).toBe(1);
    expect(component.cropperSettings.canvasWidth).toBe(500);
    expect(component.cropperSettings.canvasHeight).toBe(300);
    expect(component.cropperSettings.croppedWidth).toBe(500);
    expect(component.cropperSettings.croppedHeight).toBe(500);
  });
});
