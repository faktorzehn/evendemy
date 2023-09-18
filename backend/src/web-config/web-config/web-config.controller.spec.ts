import { Test, TestingModule } from '@nestjs/testing';
import { WebConfigController } from './web-config.controller';

describe('ConfigController', () => {
  let controller: WebConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebConfigController],
    }).compile();

    controller = module.get<WebConfigController>(WebConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
