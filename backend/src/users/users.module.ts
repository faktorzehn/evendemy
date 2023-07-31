import { Module } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsEntity } from './entities/setting.entity';
import { SettingsController } from './settings/settings.controller';
import { SettingsService } from './settings/settings.service';
import { UserController } from './user/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, SettingsEntity])],
  controllers: [UsersController, SettingsController, UserController],
  providers: [UsersService, SettingsService],
  exports: [TypeOrmModule, UsersService, SettingsService]
})
export class UsersModule {}
