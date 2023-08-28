import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { createMock } from '@golevelup/ts-jest';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(UserEntity), useFactory: createMock },
        { provide: getDataSourceToken(), useFactory: createMock },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
