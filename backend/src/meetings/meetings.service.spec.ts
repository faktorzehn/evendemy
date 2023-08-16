import { Test, TestingModule } from '@nestjs/testing';
import { MeetingsService } from './meetings.service';
import { createMock } from '@golevelup/ts-jest';
import {
  getDataSourceName,
  getDataSourceToken,
  getRepositoryToken,
} from '@nestjs/typeorm';
import { MeetingEntity } from './entities/meeting.entity';
import { MockMetadataType } from 'jest-mock';
import { NotificationAboutMeetingsService } from './notfication-about-meetings.service';

describe('MeetingsService', () => {
  let service: MeetingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeetingsService,
        { provide: getRepositoryToken(MeetingEntity), useFactory: createMock },
        { provide: getDataSourceToken(), useFactory: createMock },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(MeetingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
