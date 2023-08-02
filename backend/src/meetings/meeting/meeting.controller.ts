import { Controller, Post, Body, Param, Req, HttpException, HttpStatus, Delete, Get } from '@nestjs/common';
import { MeetingsService } from '../meetings.service';
import { UpdateMeetingDto } from '../dto/update-meeting.dto';
import { EvendemyRequest } from 'src/core/evendemy-request';
import { ImageService } from 'src/core/image.service';
import { ConfigTokens } from 'src/config.tokens';
import { ConfigService } from '@nestjs/config';
import { IdService } from 'src/core/id.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingEntity } from '../entities/meeting.entity';
import { Repository } from 'typeorm';
import { MeetingDto } from '../dto/meeting.dto';
import { CalendarService } from '../calendar.service';
import { join } from 'path';

@Controller('meeting')
export class MeetingController {

  private path = this.configService.get<string>(ConfigTokens.MEETING_IMAGE_FOLDER);

  constructor(
    private readonly meetingsService: MeetingsService, 
    private imageService: ImageService, 
    private configService: ConfigService,
    private calendarService: CalendarService,
    private idService: IdService
  ) {}

  @Post()
  async create(@Req() request: EvendemyRequest, @Body() dto: UpdateMeetingDto) {
    return this.meetingsService.create(request.user.username, dto).then(MeetingEntity.toDTO);
  }

  @Get(':mid')
  async getOne(@Req() request: EvendemyRequest, @Param('mid') mid: string) {
    return this.meetingsService.findOne(+mid).then(MeetingEntity.toDTO).then(this.checkIfPresent);
  }

  private checkIfPresent(meeting: MeetingEntity): MeetingEntity {
    if(!meeting) {
      throw new HttpException("No meeting found.", HttpStatus.NOT_FOUND)
    }
    return meeting;
  }

  @Get(':mid/calendar')
  async getCalendarForMeeting(@Req() request: EvendemyRequest, @Param('mid') mid: string) {
    return this.meetingsService.findOne(+mid).then(m => this.calendarService.createICAL(m));
  }

  @Get(":mid/image")
  async getPicture(@Req() req: EvendemyRequest, @Param('mid') mid: String){
    const meeting = await this.meetingsService.findOne(+mid);

    if(meeting.images && meeting.images.length > 0) {
      try{
        return this.imageService.read(meeting.images[0],this.path)
      } catch (err) {
        throw new HttpException("No image found for meeting", HttpStatus.NOT_FOUND);
      }
    } else {
      throw new HttpException("No image found for meeting", HttpStatus.NOT_FOUND);
    }
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
        return this.meetingsService.updateByEntity(meeting);
  }

  @Delete(":mid/image")
  async deletePicture(@Req() req: EvendemyRequest, @Param('mid') mid: string) {
        
        const meeting = await this.meetingsService.findOne(+mid);

        if(meeting.images && meeting.images.length > 0){
          // image exists - has to be deleted first
          this.imageService.delete(meeting.images[0], this.path);
        }

        meeting.images = [];
        return this.meetingsService.updateByEntity(meeting);
  }

  @Delete(":mid")
  async delete(@Req() req: EvendemyRequest, @Param('mid') mid: string) {
      const meeting = await this.meetingsService.findOne(+mid);

      if(meeting.username !== req.user.username) {
        throw new HttpException('Not allowed to delete meeting', HttpStatus.FORBIDDEN);
      }

      return this.meetingsService.delete(+mid);
  }

}
