import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { createMock } from '@golevelup/ts-jest';

describe('TagsController', () => {
  let controller: TagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
    })
    .useMocker(createMock)
    .compile();

    controller = module.get<TagsController>(TagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
