/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditorComponent } from './editor.component';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getValue returns value if not editable', () => {
    component.editable = false;
    component.value = 'xyz';

    expect(component.getValue()).toBe('xyz');
  });

  it('getValue returns value if editable and quill is set', () => {
    component.editable = true;
    component.value = 'should not be called';
    component.quill = {
      root: {
        innerHTML: 'xyz'
      }
    };

    expect(component.getValue()).toBe('xyz');
  });

  it('setValue should set quill if editabel', () => {
    component.editable = true;
    component.quill = {
      root: {
        innerHTML: '___'
      },
      update: jasmine.createSpy('update')
    };

    component.setValue('xyz');

    expect(component.quill.root.innerHTML).toBe('xyz');
    expect(component.quill.update).toHaveBeenCalled();
  });
});
