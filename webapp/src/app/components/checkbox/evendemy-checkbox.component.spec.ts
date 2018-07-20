import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvendemyCheckboxComponent } from './evendemy-checkbox.component';
import { FormsModule } from '@angular/forms';

describe('EvendemyCheckboxComponent', () => {
  let component: EvendemyCheckboxComponent;
  let fixture: ComponentFixture<EvendemyCheckboxComponent>;
  const LABEL = 'XYZ';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvendemyCheckboxComponent ],
      imports: [FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvendemyCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getCheckbox() {
    return fixture.nativeElement.querySelector('.checkbox');
  }

  function getLabel() {
    return fixture.nativeElement.querySelector('label');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show label', () => {
    component.label = LABEL;
    fixture.detectChanges();

    const label: HTMLInputElement = getLabel();
    expect(label.textContent).toBe(LABEL);
  });

  it('should return true', () => {
    const checkbox: HTMLInputElement = getCheckbox();
    component.onCheckboxChange.subscribe(x => {
      expect(x).toBeTruthy();
    });
    checkbox.click();
  });

  it('should return false', () => {
    const checkbox: HTMLInputElement = getCheckbox();
    checkbox.click();

    component.onCheckboxChange.subscribe(x => {
      expect(x).toBeFalsy();
    });
    checkbox.click();
  });

});
