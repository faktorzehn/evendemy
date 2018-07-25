import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCardComponent } from './user-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Input } from '@angular/core';


describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  @Component({selector: 'evendemy-user-image', template: ''})
  class UserImageStubComponent {
    @Input() username: String;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ UserCardComponent, UserImageStubComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user\'s name', () => {
    component.user = {
      username: 'john',
      firstname: 'John',
      lastname: 'Doe'
    };

    fixture.detectChanges();

    const label: HTMLElement = fixture.nativeElement.querySelector('.meeting-title');
    expect(label.textContent).toBe('John Doe');
  });
});
