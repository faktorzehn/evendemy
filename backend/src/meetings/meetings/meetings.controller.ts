import { Controller, Get, Req, Param, Query, ParseBoolPipe, DefaultValuePipe, ParseArrayPipe, ForbiddenException } from '@nestjs/common';
import { MeetingsService } from '../meetings.service';
import { MeetingEntity } from '../entities/meeting.entity';
import { EvendemyRequest } from 'src/shared/evendemy-request';
import { MeetingDto } from '../dto/meeting.dto';
import { BookingEntity } from '../entities/booking.entity';
import { BookingDto } from '../dto/booking.dto';
import { SettingsService } from 'src/users/settings/settings.service';

@Controller('meetings')
export class MeetingsController {
  constructor(
    private readonly meetingsService: MeetingsService,
    private readonly settingsService: SettingsService
  ) {}

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

  @Get('attending/confirmed/:username')
  async findMeetingsAttendedByUser(@Param('username') username : string, @Req() request: EvendemyRequest): Promise<MeetingDto[]>{
    const requestingUsername = request.user.username;
    // additional check if other user's data is requested
    if (requestingUsername != username){
      const settings = await this.settingsService.findOne(username);
      if (!settings || settings?.summaryOfMeetingsVisible == false){
        throw new ForbiddenException('Not allowed');
      }
    }   
    return this.meetingsService.getMeetingsForUserWhichTookPart(username).then(username => username.map(MeetingEntity.toDTO));
  }

  @Get('attending-information/:username')
  async findAttendingInformationForUser(@Param('username') username : string, @Req() request: EvendemyRequest): Promise<BookingDto[]>{
    const requestingUsername = request.user.username;
    //additional check if other users's data is requested
    if (requestingUsername != username){
      const settings = await this.settingsService.findOne(username);
      if (!settings || settings?.summaryOfMeetingsVisible == false){
        throw new ForbiddenException('Not allowed');
      } 
    }
    return this.meetingsService.getAttendingInformationForUser(username).then(username => username.map(BookingEntity.toDTO))
  }

  @Get('author/:username')
  async findMeetingsByAuthor(@Param('username') username : string, @Req() request: EvendemyRequest): Promise<MeetingDto[]>{
    const requestingUsername = request.user.username;
    //additional check if other users's data is requested
    if (requestingUsername != username){
      const settings = await this.settingsService.findOne(username);
      if (settings && settings.summaryOfMeetingsVisible == true){
        throw new ForbiddenException('Not allowed'); 
      }
    }
    return this.meetingsService.getMeetingsFromAuthor(username, requestingUsername).then(username => username.map(MeetingEntity.toDTO));
  }
}
