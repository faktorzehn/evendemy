import { Test, TestingModule } from '@nestjs/testing';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from '../meetings.service';

describe('MeetingsController', () => {
  let controller: MeetingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingsController],
      providers: [MeetingsService],
    }).compile();

    controller = module.get<MeetingsController>(MeetingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
