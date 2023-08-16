import { Test, TestingModule } from '@nestjs/testing';
import { MeetingsService } from '../meetings.service';
import { MeetingController } from '../meeting/meeting.controller';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('MeetingController', () => {
  let controller: MeetingController;
  let service: DeepMocked<MeetingsService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MeetingController],
    })
    .useMocker(createMock)
    .compile();

    controller = moduleRef.get(MeetingController);
    service = moduleRef.get(MeetingsService);
  });

  it('MeetingController should be defined', () => {
    expect(controller).toBeDefined();
  });
});