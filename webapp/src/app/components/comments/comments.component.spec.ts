import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component, Input } from '@angular/core';
import { CommentsComponent } from './comments.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NamePipe } from '../../pipes/name.pipe';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Client } from '../../middleware/client';


describe('CommentsComponent', () => {
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;
  let clientSpy: jasmine.SpyObj<Client>;
  const users = [
    {username: 'a'}, {username: 'b'}
  ]

  @Component({selector: 'evendemy-user-image', template: ''})
  class UserImageStubComponent {
    @Input() username: String;
  }

  beforeEach(async(() => {
    const spy = jasmine.createSpyObj('Client', ['getLoggedInUsername']);
    spy.getLoggedInUsername.and.returnValue('john');

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      declarations: [ CommentsComponent, UserImageStubComponent, NamePipe ],
      providers: [{ provide: Client , useValue: spy }]
    });
    clientSpy = TestBed.get(Client);
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getSubmitButton() {
    return fixture.nativeElement.querySelector('.btn');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getUser', () => {
    it('should find user', () => {
      component.users = users;
      expect(component.getUser('a')).toBe(users[0]);
    });

    it('should find no user, return username', () => {
      component.users = users;
      expect(component.getUser('c')).toBe('c');
    });
  });

  it('should return new comment', (done) => {
    component.commentbox = 'Test';
    component.comments = [];
    component.addComment.subscribe( result => {
      expect(result.text).toBe('Test');
      expect(result.author).toBe('john');
      done();
    });

    fixture.detectChanges();

    const button: HTMLElement = getSubmitButton();
    button.dispatchEvent(new Event('click'));

    expect(button).toBeDefined();
    expect(component.commentbox).toBe('');
  });

});
