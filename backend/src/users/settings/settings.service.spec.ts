import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from './settings.service';
import { createMock } from '@golevelup/ts-jest';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { SettingsEntity } from '../entities/setting.entity';
import { UserEntity } from '../entities/user.entity';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettingsService,
        {provide: getRepositoryToken(UserEntity), useFactory: createMock},
        {provide: getRepositoryToken(SettingsEntity), useFactory: createMock},
        {provide: getDataSourceToken(), useFactory: createMock},
      ],
    })
    .useMocker(createMock)
    .compile();

    service = module.get<SettingsService>(SettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
