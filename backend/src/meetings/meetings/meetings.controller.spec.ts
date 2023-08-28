import { Test, TestingModule } from '@nestjs/testing';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from '../meetings.service';
import { createMock } from '@golevelup/ts-jest';

describe('MeetingsController', () => {
  let controller: MeetingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingsController],
    })
    .useMocker(createMock)
    .compile();

    controller = module.get<MeetingsController>(MeetingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
