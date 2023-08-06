import { Controller, Post, Body, Param, Req, HttpException, HttpStatus, Delete, Get } from '@nestjs/common';
import { MeetingsService } from '../meetings.service';
import { UpdateMeetingDto } from '../dto/update-meeting.dto';
import { EvendemyRequest } from 'src/shared/evendemy-request';
import { ImageService } from 'src/core/image.service';
import { ConfigTokens } from 'src/config.tokens';
import { ConfigService } from '@nestjs/config';
import { IdService } from 'src/core/id.service';
import { MeetingEntity } from '../entities/meeting.entity';
import { CalendarService } from '../calendar.service';

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

  @Delete(":mid")
  async delete(@Req() req: EvendemyRequest, @Param('mid') mid: string) {
      const meeting = await this.meetingsService.findOne(+mid);

      if(meeting.username !== req.user.username) {
        throw new HttpException('Not allowed to delete meeting', HttpStatus.FORBIDDEN);
      }

      return this.meetingsService.delete(+mid).then(MeetingEntity.toDTO);
  }

}
