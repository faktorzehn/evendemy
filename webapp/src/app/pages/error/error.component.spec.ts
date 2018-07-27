import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorComponent } from './error.component';
import { Component } from '@angular/core';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  @Component({selector: 'evendemy-menu', template: ''})
  class EvendemyMenuStubComponent {
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorComponent, EvendemyMenuStubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
