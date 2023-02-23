import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogContentComponent } from './confirm-dialog-content.component';

describe('ConfirmDialogContentComponent', () => {
  let component: ConfirmDialogContentComponent;
  let fixture: ComponentFixture<ConfirmDialogContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDialogContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
