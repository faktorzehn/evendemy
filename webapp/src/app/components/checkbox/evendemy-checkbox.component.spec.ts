import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvendemyCheckboxComponent } from './evendemy-checkbox.component';
import { FormsModule } from '@angular/forms';

describe('EvendemyCheckboxComponent', () => {
  let component: EvendemyCheckboxComponent;
  let fixture: ComponentFixture<EvendemyCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvendemyCheckboxComponent ],
      imports:[FormsModule]
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
