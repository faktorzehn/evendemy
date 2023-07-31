import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseBoolPipe, DefaultValuePipe, ParseArrayPipe } from '@nestjs/common';
import { MeetingsService } from '../meetings.service';
import { UpdateMeetingDto } from '../dto/update-meeting.dto';

@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get()
  findAll(
    @Query('showNotAnnounced', new DefaultValuePipe(false), ParseBoolPipe) showNotAnnounced: boolean, // ParseBoolPipe expect that there is a vlaue, therefore we need the DefaultValuePipe
    @Query('showOld', new DefaultValuePipe(false), ParseBoolPipe) showOld: boolean, 
    @Query('showNew', new DefaultValuePipe(false), ParseBoolPipe) showNew: boolean, 
    @Query('idea', new DefaultValuePipe(false), ParseBoolPipe) idea: boolean,
    @Query('tags', new DefaultValuePipe([]), new ParseArrayPipe({items: String, separator: ','}),) tags: string[],
    @Query('username') username?: string, 
    @Query('courseOrEvent') courseOrEvent?: 'course' | 'event',
    ) {
    return this.meetingsService.findAll({
      showNotAnnounced: showNotAnnounced,
      showOld: showOld,
      showNew: showNew,
      username: username,
      courseOrEvent: courseOrEvent,
      idea: idea,
      tags: tags
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMeetingDto: UpdateMeetingDto) {
    return this.meetingsService.update(+id, updateMeetingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingsService.delete(+id);
  }
}
