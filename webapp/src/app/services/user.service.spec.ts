import { InitUsers } from '../actions/users.actions';
import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule, HttpTestingController
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

describe ('UserService', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let config;
  let userService;

  beforeEach(() => {
    config = jasmine.createSpyObj('ConfigService', ['getSettings']);
    config.getSettings.and.returnValue({backend_url: ''});

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);

    userService = new UserService(httpClient, config);
  });

  function verifyRequest(method: string, url: string, data?: any) {
    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual(method);

    if (data) {
      expect(req.request.body).toEqual(data);
    }

    httpTestingController.verify();
  }

  it('addImage should call POST request', () => {
    const data: any = { some: 'data'};
    const username = 'john';

    userService.addImage(username, data).subscribe(() => {});

    verifyRequest('POST', '/user/john/image', data);
  });

  it('deleteImage should call DELETE request', () => {
    const username = 'john';

    userService.deleteImage(username).subscribe(() => {});

    verifyRequest('DELETE', '/user/john/image');
  });

  it('updateSettings should call PUT request', () => {
    const options = {
      additional_info_visible: true,
      summary_of_meetings_visible: false
    };
    const username = 'john';

    userService.updateSettings(username, options).subscribe(() => {});

    verifyRequest('PUT', '/user/john/settings', options);
  });

  it('updateAdditionalInfo should call PUT request', () => {
    const options = {
      additional_info_visible: true,
      summary_of_meetings_visible: false
    };
    const username = 'john';

    userService.updateAdditionalInfo(username, options).subscribe(() => {});

    verifyRequest('PUT', '/user/john/additional_info', options);
  });


});
