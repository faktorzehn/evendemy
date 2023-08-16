import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { createMock } from '@golevelup/ts-jest';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    })
    .useMocker(createMock)
    .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
