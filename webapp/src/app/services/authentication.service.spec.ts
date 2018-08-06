import { AuthenticationService } from './authentication.service';
import { httpFactory } from '@angular/http/src/http_module';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('AuthenticationService', () => {

  let authService;
  let httpClient;
  let httpTestingController;
  let store;

  beforeEach( () => {

    const config = jasmine.createSpyObj('ConfigService', ['getSettings']);
    config.getSettings.and.returnValue({backend_url: ''});

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);

    store = jasmine.createSpyObj('Store', ['dispatch']);

    authService = new AuthenticationService(httpClient, config, store);

  });

  function verifyRequest(method: string, url: string, data?: any) {
    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual(method);

    if (data) {
      expect(req.request.body).toEqual(data);
    }

    httpTestingController.verify();
  }

  it('loginUser should make request and if successfull then save it to localstorage', (done) => {
    const username = 'admin';
    const password = 'password';

    const localstorageSpy = spyOn(localStorage, 'setItem');

    authService.loginUser(username, password).subscribe(result => {
      expect(localstorageSpy).toHaveBeenCalledWith('token' , 'Basic YWRtaW46cGFzc3dvcmQ=');
      expect(localstorageSpy).toHaveBeenCalledWith('username', username);
      done();
    });

    const req = httpTestingController.expectOne('/auth');
    req.flush({});
    expect(req.request.method).toEqual('POST');

    httpTestingController.verify();

  });

  it('loginUser should make request and if not successfull it should not save to localstorage', (done) => {
    const username = 'admin';
    const password = 'password';

    const localstorageSpy = spyOn(localStorage, 'setItem');

    authService.loginUser(username, password).subscribe(result => {
      expect(true).toBeFalsy('this path should never have passed');
      done();
    }, (error) => {
      expect(localstorageSpy).not.toHaveBeenCalledWith('token' , 'Basic YWRtaW46cGFzc3dvcmQ=');
      expect(localstorageSpy).not.toHaveBeenCalledWith('username', username);
      done();
    });

    const req = httpTestingController.expectOne('/auth');
    req.error(new ErrorEvent('fail'), {status: 401});
    expect(req.request.method).toEqual('POST');

    httpTestingController.verify();

  });

  it('logoutUser should remove keys from localstorage', () => {
    const localstorageSpy = spyOn(localStorage, 'removeItem');

    authService.logoutUser();

    expect(localstorageSpy).toHaveBeenCalledWith('token');
    expect(localstorageSpy).toHaveBeenCalledWith('username');
  });

  it('isLoggedIn should return true', () => {
    const localstorageSpy = spyOn(localStorage, 'getItem').and.returnValue('my-secret-token');
    expect(authService.isLoggedIn()).toBeTruthy();
  });

  it('isLoggedIn should return false', () => {
    const localstorageSpy = spyOn(localStorage, 'getItem').and.returnValue(null);
    expect(authService.isLoggedIn()).toBeFalsy();
  });

  it('getLoggedInUsername should return username', () => {
    const localstorageSpy = spyOn(localStorage, 'getItem').and.returnValue('AdMiN');
    expect(authService.getLoggedInUsername()).toBe('admin');
  });

});
