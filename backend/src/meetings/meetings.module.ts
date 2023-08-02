import { Module } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { MeetingsController } from './meetings/meetings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingEntity } from './entities/meeting.entity';
import { CommentEntity } from './entities/comment.entity';
import { MeetingUserEntity } from './entities/meeting_user.entity';
import { MeetingController } from './meeting/meeting.controller';
import { UsersModule } from 'src/users/users.module';
import { NotificationAboutMeetingsService } from './notfication-about-meetings.service';
import { CalendarService } from './calendar.service';
import { TagsController } from './tags/tags.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingEntity, CommentEntity, MeetingUserEntity]), UsersModule],
  controllers: [MeetingsController, MeetingController, TagsController],
  providers: [MeetingsService, NotificationAboutMeetingsService, CalendarService]
})
export class MeetingsModule {}
