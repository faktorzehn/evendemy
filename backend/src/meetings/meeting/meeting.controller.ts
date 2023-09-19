import { Controller, Post, Body, Param, Req, HttpException, HttpStatus, Delete, Get, Put, Header } from '@nestjs/common';
import { MeetingsService } from '../meetings.service';
import { UpdateMeetingDto } from '../dto/update-meeting.dto';
import { EvendemyRequest } from 'src/shared/evendemy-request';
import { ImageService } from 'src/core/image.service';
import { ConfigTokens } from 'src/config.tokens';
import { ConfigService } from '@nestjs/config';
import { IdService } from 'src/core/id.service';
import { MeetingEntity } from '../entities/meeting.entity';
import { CalendarService } from '../calendar.service';
import { BookingEntity } from '../entities/booking.entity';
import { BookingDto } from '../dto/booking.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { MeetingDto } from '../dto/meeting.dto';
import { UsersService } from 'src/users/users/users.service';
import { NotificationAboutMeetingsService } from '../notfication-about-meetings.service';

@Controller('api/meeting')
export class MeetingController {

  private path = this.configService.get<string>(ConfigTokens.MEETING_IMAGE_FOLDER);

  constructor(
    private readonly meetingsService: MeetingsService, 
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationAboutMeetingsService,
    private imageService: ImageService, 
    private configService: ConfigService,
    private calendarService: CalendarService,
    private idService: IdService
  ) {}

  @Post()
  async create(@Req() request: EvendemyRequest, @Body() dto: UpdateMeetingDto) {
    return this.meetingsService.create(request.user. preferred_username, dto).then(MeetingEntity.toDTO);
  }

  @Get(':mid')
  async getOne(@Req() request: EvendemyRequest, @Param('mid') mid: string) {
    return this.meetingsService.findOne(+mid).then(MeetingEntity.toDTO);
  }

  @Get(':mid/calendar')
  async getCalendarForMeeting(@Req() request: EvendemyRequest, @Param('mid') mid: string) {
    return this.meetingsService.findOne(+mid).then(m => this.calendarService.createICAL(m));
  }

  @Post(":mid/image")
  async changePicture(@Req() req: EvendemyRequest, @Param('mid') mid: string) {
        var data = (req.body as any).data;
        if(!data) {
            throw new HttpException('No image', HttpStatus.NOT_ACCEPTABLE);
        }

        const meeting = await this.meetingsService.findOne(+mid);

        if(meeting.images && meeting.images.length > 0){
          // image exists - has to be deleted first
          this.imageService.delete(meeting.images[0], this.path);
        }

        let newId = this.idService.id();

        while(this.imageService.exists(newId, this.path)) {
          newId = this.idService.id();
        }

        this.imageService.save(newId, data, this.path);

        meeting.images = [newId];
        return this.meetingsService.updateByEntity(meeting).then(MeetingEntity.toDTO);
  }

  @Get(":mid/image")
  @Header('Content-Type', 'image/jpeg')
  async getPicture(@Req() req: EvendemyRequest, @Param('mid') mid: String){
    const meeting = await this.meetingsService.findOne(+mid);

    if(meeting.images && meeting.images.length > 0) {
      try{
        return this.imageService.read(meeting.images[0],this.path);
      } catch (err) {
        throw new HttpException("No image found for meeting", HttpStatus.NOT_FOUND);
      }
    } else {
      throw new HttpException("No image found for meeting", HttpStatus.NOT_FOUND);
    }
  }

  @Delete(":mid/image")
  async deletePicture(@Req() req: EvendemyRequest, @Param('mid') mid: string) {
        const meeting = await this.meetingsService.findOne(+mid);

        if(meeting.images && meeting.images.length > 0){
          // image exists - has to be deleted first
          this.imageService.delete(meeting.images[0], this.path);
        }

        meeting.images = [];
        return this.meetingsService.updateByEntity(meeting).then(MeetingEntity.toDTO);
  }

  @Post(":mid/comment")
  async postComment(@Param('mid') mid: string, @Body() updateCommentDto: UpdateCommentDto, @Req() req: EvendemyRequest) {
    const meetingId = parseInt(mid);
    if (isNaN(meetingId)) {
      throw new HttpException('Meeting id is not a number', HttpStatus.BAD_REQUEST);
    }
    if (!updateCommentDto.text) {
      throw new HttpException('No comment', HttpStatus.NOT_ACCEPTABLE);
    }
    return this.meetingsService.addComment(meetingId, req.user. preferred_username, updateCommentDto.text).then(MeetingEntity.toDTO);
  }


  @Put(":mid")
  async updateMeeting(@Param('mid') mid: string, @Body() meetingEntity : MeetingEntity): Promise<MeetingDto>{
    const meetingID = parseInt(mid);
    if (isNaN(meetingID)){
      throw new HttpException('Meeting id is not a number', HttpStatus.BAD_REQUEST);
    }
    const existingMeeting = await this.meetingsService.findOne(meetingID);
    if (!existingMeeting){
      throw new HttpException('Meeting does not exist', HttpStatus.NOT_FOUND);
    }
    return await this.meetingsService.update(meetingID, meetingEntity).then(MeetingEntity.toDTO);
  }

  @Delete(":mid")
  async delete(@Req() req: EvendemyRequest, @Param('mid') mid: string) {
      const meeting = await this.meetingsService.findOne(+mid);

      if(meeting.username !== req.user. preferred_username) {
        throw new HttpException('Not allowed to delete meeting', HttpStatus.FORBIDDEN);
      }

      return this.meetingsService.delete(+mid).then(MeetingEntity.toDTO);
  }

  @Get(":mid/attendees")
  async getAttendess(@Param('mid') mid : string): Promise<BookingDto[]>{
    const meetingID = parseInt(mid);
    if (isNaN(meetingID)){
      throw new HttpException('Meeting ID is not a number', HttpStatus.BAD_REQUEST);
    }
    const existingMeeting = await this.meetingsService.findOne(meetingID);
    if (!existingMeeting){
      throw new HttpException('Meeting does not exist', HttpStatus.NOT_FOUND);
    }
    return this.meetingsService.getBookingsByMeetingID(meetingID).then(attendees => attendees.map(BookingEntity.toDTO));
  }

  @Put(":mid/attendee/:username/attend")
  async bookMeeting(@Param('mid') mid : string, @Param('username') username : string, @Body() body: BookingDto, @Req() req: EvendemyRequest): Promise<BookingDto>{
    const meetingID = parseInt(mid);
    if (isNaN(meetingID)){
      throw new HttpException('Meeting ID is not a number', HttpStatus.NOT_ACCEPTABLE);
    }
    if(!mid || !username){
      throw new HttpException('No mid or username', HttpStatus.NOT_ACCEPTABLE);
    }
    if(username != req.user. preferred_username) {
      throw new HttpException('Booking can only be added by the user himself.', HttpStatus.FORBIDDEN);
    }
    const meeting = await this.meetingsService.findOne(meetingID);
    const user = await this.usersService.findOne(req.user. preferred_username);
    const externals = body.externals ?? [];
    if(!meeting || !user){
      throw new HttpException('Meeting or user does not exist', HttpStatus.NOT_FOUND);
    }
    return this.meetingsService.attendingToMeeting(meetingID, req.user. preferred_username, externals).then(BookingEntity.toDTO);
  }

  @Delete(":mid/attendee/:username/attend")
  async deleteBooking(@Param('mid') mid : string, @Param('username') username : string, @Req() req: EvendemyRequest): Promise<BookingDto>{
    const meetingID = parseInt(mid);
    if (isNaN(meetingID)){
      throw new HttpException('Meeting ID is not a number', HttpStatus.NOT_ACCEPTABLE);
    }
    if(!mid || !username){
      throw new HttpException('No mid or username', HttpStatus.NOT_ACCEPTABLE);
    }
    const meeting = await this.meetingsService.findOne(meetingID);
    const user = await this.usersService.findOne(username);

    if (!meeting || !user){
      throw new HttpException('Meeting or user does not exist', HttpStatus.NOT_FOUND);
    }
    // booking can only be deleted by the user himself or by the author
    if(!(username === req.user. preferred_username || req.user. preferred_username === meeting.username)) {
      throw new HttpException('Booking is not allowed to be deleted.', HttpStatus.FORBIDDEN);
    }
    return this.meetingsService.notAttendingToMeeting(meetingID, username).then(BookingEntity.toDTO);
  }

  @Put(":mid/attendee/:username/confirm")
  async confirmUser(@Param('mid') mid : string, @Param('username') username : string, @Req() req: EvendemyRequest): Promise<BookingDto>{
    const meetingID = parseInt(mid);
    if (isNaN(meetingID)){
      throw new HttpException('Meeting ID is not a number', HttpStatus.BAD_REQUEST);
    }
    if (!mid || !username){
      throw new HttpException('No mid or username', HttpStatus.NOT_ACCEPTABLE);
    }
    const meeting = await this.meetingsService.findOne(meetingID);
    if (req.user. preferred_username != meeting.username){
      throw new HttpException('Confirmation is only allowed by the author', HttpStatus.FORBIDDEN);
    }
    return this.meetingsService.confirmUserForMeeting(meetingID, username).then(BookingEntity.toDTO);
  }

  @Delete(":mid/attendee/:username/confirm")
  async rejectUser(@Param('mid') mid : string, @Param('username') username : string, @Req() req: EvendemyRequest): Promise<BookingDto>{
    const meetingID = parseInt(mid);
    if (isNaN(meetingID)){
      throw new HttpException('Meeting ID is not a number', HttpStatus.BAD_REQUEST);
    }
    if(!mid || !username){
      throw new HttpException('No mid or username', HttpStatus.NOT_ACCEPTABLE);
    }
    const meeting = await this.meetingsService.findOne(meetingID);
    if (req.user. preferred_username != meeting.username){
      throw new HttpException('Rejection is only allowed by the author', HttpStatus.FORBIDDEN);
    }
    return this.meetingsService.rejectUserFromMeeting(meetingID, username).then(BookingEntity.toDTO);
  }
}