import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvendemyCheckboxComponent } from './evendemy-checkbox.component';

describe('EvendemyCheckboxComponent', () => {
  let component: EvendemyCheckboxComponent;
  let fixture: ComponentFixture<EvendemyCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvendemyCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvendemyCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
