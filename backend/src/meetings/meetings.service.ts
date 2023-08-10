import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { MeetingEntity } from './entities/meeting.entity';
import { FindOptionsWhere, Repository, MoreThanOrEqual, LessThan, IsNull, Admin, FindOperator, ArrayContains, And, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationAboutMeetingsService } from './notfication-about-meetings.service';
import { BookingEntity } from './entities/booking.entity';
import { CommentEntity } from './entities/comment.entity';
import { UsersService } from 'src/users/users/users.service';
import { CalendarService } from './calendar.service';

class MeetingsFilter {
  showNotAnnounced: boolean;
  showOld: boolean;
  showNew: boolean; 
  username?: string; 
  courseOrEvent?: 'course' | 'event';
  idea: boolean;
  tags: string[];
}

@Injectable()
export class MeetingsService {

  constructor(
    @InjectRepository(MeetingEntity)
    private meetingRepository: Repository<MeetingEntity>,
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
    private notificationAboutMeetingsService: NotificationAboutMeetingsService,
    private calenderService: CalendarService,
    private usersService: UsersService,
    private dataSource: DataSource)
  { }

  async create(username: string, updateMeetingDto: UpdateMeetingDto): Promise<MeetingEntity> {
    const meeting = this.meetingRepository.create(updateMeetingDto);
    meeting.username = username;
    meeting.tags = [];
    meeting.comments = [];
    meeting.images = [];
    return this.meetingRepository.save(meeting).then(m => this.notificationAboutMeetingsService.newMeeting(m));
  }

  findAll(filter: MeetingsFilter) {
    let options: FindOptionsWhere<MeetingEntity>[] = [{
      courseOrEvent: filter.courseOrEvent,
      isIdea: filter.idea,
      deleted: false
    }];

    if(filter.username) {
      options[0].username = filter.username;
    }    
    
    if(filter.tags && filter.tags.length > 0) {
      options[0].tags = ArrayContains(filter.tags);
    }

    if(filter.showNew && filter.showNotAnnounced && filter.showOld) {
      // filter has not to be set
    } else {
      var createDateConditions: FindOperator<Date>[] = [];
      if(filter.showNew) {
        createDateConditions.push(MoreThanOrEqual(new Date()));
      }

      if(filter.showOld) {
        createDateConditions.push(LessThan(new Date()));
      }

      if(filter.showNotAnnounced) {
        createDateConditions.push(IsNull());
      }

      createDateConditions.forEach((cond, index) => {
          if(options.length < index) {
            options.push({...options[0]});
          }
          options[index].startTime = cond;
      });
    }

    return this.meetingRepository.findBy(options);
  }

  findOne(id: number){
    return this.meetingRepository.findOneBy({mid: id, deleted: false});
  }

  async update(id: number, newMeeting: MeetingEntity): Promise<MeetingEntity> {
    const meeting = await this.meetingRepository.findOne({where: {mid: id}});
    const bookings = await this.getBookingsByMeetingID(id); //meeting.bookings doesnt work -> undefined
    if(this.checkIsDiff(meeting, newMeeting)){
      if ((meeting.startTime != newMeeting.startTime) || (meeting.endTime != newMeeting.endTime)){
        const iCal = this.calenderService.createICAL(meeting);
        return this.meetingRepository.save(meeting).then(m => this.notificationAboutMeetingsService.timeChanged(m, bookings, iCal));
      }
      if (meeting.location != newMeeting.location){
        return this.meetingRepository.save(meeting).then(m => this.notificationAboutMeetingsService.locationChanged(m, bookings));
      }
      this.updateMeeting(meeting, newMeeting);
    }
    return this.meetingRepository.save(meeting);
  }

  private checkIsDiff(meeting: MeetingEntity, newMeeting: MeetingEntity): boolean{
    const oldMeetingJson = JSON.stringify(meeting);
    const newMeetingJson = JSON.stringify(newMeeting);
    if (oldMeetingJson != newMeetingJson){
      return true;
    }
    return false;
  }

  async updateMeeting(meeting: MeetingEntity, request: MeetingEntity): Promise<MeetingEntity>{
    const updatedFields: Partial<MeetingEntity> = {};
    if (request.title != undefined){
      updatedFields.title = request.title;
    }
    if(request.shortDescription != undefined){
      updatedFields.shortDescription = request.shortDescription;
    }
    if (request.description != undefined){
      updatedFields.description = request.description;
    }
    if (request.startTime != undefined){
      updatedFields.startTime = request.startTime;
    }
    if(request.endTime != undefined){
      updatedFields.endTime = request.endTime;
    }
    if(request.location != undefined){
      updatedFields.location = request.location;
    }
    if(request.costCenter != undefined){
      updatedFields.costCenter = request.costCenter;
    }
    if(request.courseOrEvent != undefined){
      updatedFields.courseOrEvent = request.courseOrEvent;
    }
    if(request.isIdea != undefined){
      updatedFields.isIdea = request.isIdea;
    }
    if (request.isFreetime != undefined){
      updatedFields.isFreetime = request.isFreetime;
    }
    if(request.numberOfAllowedExternals != undefined){
      updatedFields.numberOfAllowedExternals = request.numberOfAllowedExternals;
    }
    if(request.tags != undefined){
      updatedFields.tags = request.tags;
    }
    if(request.images != undefined){
      updatedFields.images = request.images;
    }
    Object.assign(meeting, updatedFields);
    return this.meetingRepository.save(meeting);
  }

  updateByEntity(meetingEntity: MeetingEntity) {
    return this.meetingRepository.save(meetingEntity);
  }

  async delete(id: number) {
    const meeting = await this.meetingRepository.findOne({where: {mid: id}});
    meeting.deleted = true;
    const attendees = await this.getBookingsByMeetingID(id);
    return this.meetingRepository.save(meeting).then(m => this.notificationAboutMeetingsService.deletedMeeting(m, attendees));
  }

  async addComment(id: number, username: string, text: string): Promise<MeetingEntity>{
    const meeting = await this.meetingRepository.findOne({where: {mid: id}, relations: {comments: true}});
    if(!meeting){
      throw new HttpException('Meeting not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.usersService.findOne(username);
    const comment = new CommentEntity();
    comment.text = text;
    comment.username = username;
    comment._user = user;
    if(!meeting.comments){
      meeting.comments = [];
    }
    meeting.comments.push(comment);
    const attendees = await this.getBookingsByMeetingID(id);
    return this.meetingRepository.save(meeting).then(m => this.notificationAboutMeetingsService.newComment(m, comment, attendees));
  }

  async getBookingsByMeetingID(id: number): Promise<BookingEntity[]>{
    const meeting = await this.meetingRepository.findOne({where: {mid: id}});
    if (!meeting){
      throw new HttpException('Meeting not found', HttpStatus.NOT_FOUND);
    }
    return this.bookingRepository.save(await this.bookingRepository.find({ where: { mid: id }, relations: {user: true}}));
  }

  getAllTags(): Promise<string[]> {
    return this.dataSource.createQueryBuilder()
    .select("distinct UNNEST(meeting.tags)", 't')
    .from(MeetingEntity, "meeting")
    .where("meeting.tags <> '{}'")
    .getRawMany().then( result => result ? result.map(r => r.t): [])
  }
}
