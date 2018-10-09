import { TagsService } from './tags.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe ('TagsService', () => {

  let tagsService: TagsService;
  let config;
  let httpClient;
  let httpTestingController;

  beforeEach(() => {
    config = jasmine.createSpyObj('ConfigService', ['getSettings']);
    config.getSettings.and.returnValue({backend_url: ''});

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);

    tagsService = new TagsService(httpClient, config);
  });

  function verifyRequest(method: string, url: string, data?: any) {
    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual(method);

    if (data) {
      expect(req.request.body).toEqual(data);
    }

    httpTestingController.verify();
  }

  it('getAllTags', () => {
    tagsService.getAllTags().subscribe(() => {});

    verifyRequest('GET', '/tags');
  });

});
