import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseBoolPipe, DefaultValuePipe, ParseArrayPipe } from '@nestjs/common';
import { MeetingsService } from '../meetings.service';
import { UpdateMeetingDto } from '../dto/update-meeting.dto';
import { MeetingEntity } from '../entities/meeting.entity';

@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get()
  findAll(
    @Query('showOld', new DefaultValuePipe(false), ParseBoolPipe) showOld: boolean, // ParseBoolPipe expect that there is a vlaue, therefore we need the DefaultValuePipe
    @Query('showNew', new DefaultValuePipe(false), ParseBoolPipe) showNew: boolean, 
    @Query('idea', new DefaultValuePipe(false), ParseBoolPipe) idea: boolean,
    @Query('tags', new DefaultValuePipe([]), new ParseArrayPipe({items: String, separator: ','}),) tags: string[],
    @Query('username') username?: string, 
    @Query('courseOrEvent') courseOrEvent?: 'course' | 'event',
    ) {
    return this.meetingsService.findAll({
      showOld: showOld,
      showNew: showNew,
      username: username,
      courseOrEvent: courseOrEvent,
      idea: idea,
      tags: tags
    }).then(meetings => meetings.map(MeetingEntity.toDTO));
  }
}
