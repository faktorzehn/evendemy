import { UsersService } from './users.service';
import { InitUsers } from '../actions/users.actions';
import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule, HttpTestingController
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

describe ('UsersService', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let store;
  let config;
  let usersService;

  beforeEach(() => {
    store = jasmine.createSpyObj('Store', ['dispatch']);
    config = jasmine.createSpyObj('ConfigService', ['getSettings']);
    config.getSettings.and.returnValue({backend_url: ''});

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);

    usersService = new UsersService(httpClient, store, config);
  });

  it('loadAllUsers should load all and dispatch them', (done) => {
    const users: any = ['some', 'users'];

    usersService.loadAllUsers().subscribe(val => {
      expect(val).toBe(users);
      expect(store.dispatch).toHaveBeenCalledWith(new InitUsers(users));
      done();
    });

    //mock http call
    const req = httpTestingController.expectOne('/users');
    expect(req.request.method).toEqual('GET');
    req.flush(users);
    httpTestingController.verify();
  });

  it('setUsers should call InitUsers action', () => {
    const users: any = ['some', 'users'];
    usersService.setUsers(users);
    expect(store.dispatch).toHaveBeenCalledWith(new InitUsers(users));
  });

});
