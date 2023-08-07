import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { MeetingEntity } from './entities/meeting.entity';
import { FindOptionsWhere, Repository, MoreThanOrEqual, LessThan, IsNull, Admin, FindOperator, ArrayContains, And, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationAboutMeetingsService } from './notfication-about-meetings.service';
import { AttendingEntity } from './entities/attending.entity';
import { CommentDto } from './dto/comment.dto';
import { CommentEntity } from './entities/comment.entity';
import { AttendingDto } from './dto/attending.dto';

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
    @InjectRepository(AttendingEntity)
    private AttedingRepository: Repository<AttendingEntity>,
    private notificationAboutMeetingsService: NotificationAboutMeetingsService,
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

  update(id: number, updateMeetingDto: UpdateMeetingDto) {
    return `This action updates a #${id} meeting`;
  }

  updateByEntity(meetingEntity: MeetingEntity) {
    return this.meetingRepository.save(meetingEntity);
  }

  async delete(id: number) {
    const meeting = await this.meetingRepository.findOne({where: {mid: id}});
    meeting.deleted = true;
    return this.meetingRepository.save(meeting).then(m => this.notificationAboutMeetingsService.deletedMeeting(m));
  }

  async addComment(id: number, username: string, text: string): Promise<MeetingEntity>{
    console.log(username);
    const meeting = await this.meetingRepository.findOne({where: {mid: id}, relations: {comments: true}});
    if(!meeting){
      throw new HttpException('Meeting not found', HttpStatus.NOT_FOUND);
    }
    const comment = new CommentEntity();
    comment.text = text;
    comment.username = username;
    if(!meeting.comments){
      meeting.comments = [];
    }
    meeting.comments.push(comment);
    const attendees = await this.getAttendeesByMeetingID(id);
    return this.meetingRepository.save(meeting).then(m => this.notificationAboutMeetingsService.newComment(m, comment, attendees));
  }

  async getAttendeesByMeetingID(id: number): Promise<AttendingEntity[]>{
    const meeting = await this.meetingRepository.findOne({where: {mid: id}});
    if (!meeting){
      throw new HttpException('Meeting not found', HttpStatus.NOT_FOUND);
    }
    const attendees = await this.AttedingRepository.find({ where: { mid: id }, relations: {user: true}});
    await this.AttedingRepository.save(attendees);
    return attendees;
  }

  getAllTags(): Promise<string[]> {
    return this.dataSource.createQueryBuilder()
    .select("distinct UNNEST(meeting.tags)", 't')
    .from(MeetingEntity, "meeting")
    .where("meeting.tags <> '{}'")
    .getRawMany().then( result => result ? result.map(r => r.t): [])
  }
}
