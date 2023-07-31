import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [AuthController],
  imports: [UsersModule]
})
export class AuthModule {}
