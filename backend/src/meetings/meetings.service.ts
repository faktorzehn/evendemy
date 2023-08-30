import { HttpException, HttpStatus, Injectable, ForbiddenException } from '@nestjs/common';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { MeetingEntity, VALIDITY_PERIODE } from './entities/meeting.entity';
import { FindOptionsWhere, Repository, MoreThanOrEqual, LessThan, FindOperator, ArrayContains, DataSource, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationAboutMeetingsService } from './notfication-about-meetings.service';
import { BookingEntity } from './entities/booking.entity';
import { CommentEntity } from './entities/comment.entity';
import { UsersService } from 'src/users/users/users.service';
import { CalendarService } from './calendar.service';
import { sub } from 'date-fns';
import { SettingsService } from 'src/users/settings/settings.service';

class MeetingsFilter {
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
    private settingsService: SettingsService,
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

    if(filter.idea) {
      if(filter.showNew && filter.showOld) {
        // filter has not to be set
      } else {
        var createDateConditions: {creationDate: FindOperator<Date>, validityPeriod: VALIDITY_PERIODE}[] = [];
     
        if(filter.showNew) {
          createDateConditions.push({
            creationDate: MoreThanOrEqual(sub(new Date(), {days: 7})), 
            validityPeriod: '1_WEEK'
          });
          createDateConditions.push({
            creationDate: MoreThanOrEqual(sub(new Date(), {days: 14})), 
            validityPeriod: '2_WEEKS'
          });
        }
  
        if(filter.showOld) {
          createDateConditions.push({
            creationDate: LessThan(sub(new Date(), {days: 7})), 
            validityPeriod: '1_WEEK'
          });
          createDateConditions.push({
            creationDate: LessThan(sub(new Date(), {days: 14})), 
            validityPeriod: '2_WEEKS'
          });
        }

        createDateConditions.forEach((cond, index) => {
          if(options.length <= index) {
            options.push({...options[0]});
          }
          options[index].creationDate = cond.creationDate;
          options[index].validityPeriode = cond.validityPeriod;
        });
      }
    } else {
      if(filter.showNew && filter.showOld) {
        // filter has not to be set
      } else {
        if(filter.showNew) {
          options[0].startTime = MoreThanOrEqual(new Date());
        }
  
        if(filter.showOld) {
          options[0].startTime =LessThan(new Date());
        }
      }
    }


    return this.meetingRepository.find({ where: options, relations: {
      comments: true
    }});
  }

  findOne(id: number){
    return this.meetingRepository.findOne({
      where:{mid: id, deleted: false},
      relations: {
        comments: true
      }
    });
  }

  async update(id: number, newMeeting: MeetingEntity): Promise<MeetingEntity> {
    const meeting = await this.meetingRepository.findOne({where: {mid: id}});
    const bookings = await this.getBookingsByMeetingID(id); //meeting.bookings doesnt work -> undefined
    if ((meeting.startTime != newMeeting.startTime) || (meeting.endTime != newMeeting.endTime)){
      const iCal = this.calenderService.createICAL(newMeeting);
      await this.notificationAboutMeetingsService.timeChanged(newMeeting, bookings, iCal);
    }
    if (meeting.location != newMeeting.location){
      await this.notificationAboutMeetingsService.locationChanged(newMeeting, bookings);
    }
    const updatedMeeting = this.setMeetingFields(meeting, newMeeting);
    return this.meetingRepository.save(updatedMeeting);
  }


  private setMeetingFields(oldMeeting: MeetingEntity, newMeeting: MeetingEntity): MeetingEntity{
    const updatedFields: Partial<MeetingEntity> = {};
    if (newMeeting.title != undefined){
      updatedFields.title = newMeeting.title;
    }
    if(newMeeting.shortDescription != undefined){
      updatedFields.shortDescription = newMeeting.shortDescription;
    }
    if (newMeeting.description != undefined){
      updatedFields.description = newMeeting.description;
    }
    if (newMeeting.startTime != undefined){
      updatedFields.startTime = newMeeting.startTime;
    }
    if(newMeeting.endTime != undefined){
      updatedFields.endTime = newMeeting.endTime;
    }
    if(newMeeting.location != undefined){
      updatedFields.location = newMeeting.location;
    }
    if(newMeeting.costCenter != undefined){
      updatedFields.costCenter = newMeeting.costCenter;
    }
    if(newMeeting.courseOrEvent != undefined){
      updatedFields.courseOrEvent = newMeeting.courseOrEvent;
    }
    if(newMeeting.isIdea != undefined){
      updatedFields.isIdea = newMeeting.isIdea;
    }
    if (newMeeting.isFreetime != undefined){
      updatedFields.isFreetime = newMeeting.isFreetime;
    }
    if(newMeeting.numberOfAllowedExternals != undefined){
      updatedFields.numberOfAllowedExternals = newMeeting.numberOfAllowedExternals;
    }
    if(newMeeting.tags != undefined){
      updatedFields.tags = newMeeting.tags;
    }
    if(newMeeting.validityPeriode != undefined) {
      updatedFields.validityPeriode = newMeeting.validityPeriode;
    }
    Object.assign(oldMeeting, updatedFields);
    return oldMeeting;
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
    return this.bookingRepository.save(await this.bookingRepository.find({ where: { mid: id, deleted: false }, relations: {user: true}}));
  }

  async confirmUserForMeeting(id: number, username: string): Promise<BookingEntity>{
    username = username.toLowerCase();
    const booking = await this.bookingRepository.findOne({
      where: {mid: id, user: {username: username}, deleted: false},
      relations: {user: true}
    });
    if (!booking) {
      throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
    }
    booking.tookPart = true;
    booking.dateOfConfirmation = new Date();
    return this.bookingRepository.save(booking);
  }

  async rejectUserFromMeeting(id: number, username: string): Promise<BookingEntity>{
    username = username.toLowerCase();
    const booking = await this.bookingRepository.findOne({
      where: {mid: id, user: {username: username}, deleted: false},
      relations: {user: true}
    });
    if(!booking){
      throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
    }
    booking.tookPart = false;
    return this.bookingRepository.save(booking);
  }

  async attendingToMeeting(mid: number, username: string, externals: string[]){
    username = username.toLowerCase();
    const booking = await this.bookingRepository.findOne({
      where: {mid: mid, user: {username: username}, deleted: false},
      relations: {user: true}
    });

    // at the moment only one external is allowed - to be changed
    const _externals: [string] = externals.length > 0 ? [externals[0]] : [''];

    if (!booking){
      const newBooking = new BookingEntity();
      newBooking.mid = mid;
      const user = await this.usersService.findOne(username);
      newBooking.user = user;
      newBooking.tookPart = false;
      newBooking.externals = _externals;
      newBooking.deleted = false;
      const savedBooking = await this.bookingRepository.save(newBooking);
      const meeting = await this.meetingRepository.findOne({where: {mid: mid}});
      if (meeting && savedBooking.user) {
        this.notificationAboutMeetingsService.notifyAuthorAboutBooking(true, meeting, savedBooking.user);
      }
      return savedBooking;
    }
    return booking;
  }

  async notAttendingToMeeting(mid: number, username: string): Promise<BookingEntity> {
    username = username.toLowerCase();
    const booking = await this.bookingRepository.findOne({
        where: { mid: mid, user: { username: username }, deleted: false },
        relations: { user: true }
    });
    if (!booking) {
        throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
    }
    const meeting = await this.meetingRepository.findOne({ where: { mid: mid } });

    if (meeting) {
        booking.deleted = true;
        const savedBooking = await this.bookingRepository.save(booking);
        if (meeting.username === booking.user.username) {
          await this.notificationAboutMeetingsService.confirmNotAttending(booking.user, meeting);
        } else {
          await this.notificationAboutMeetingsService.notifyAuthorAboutBooking(false, meeting, booking.user);
        }
        return savedBooking;
    }
}


  async getMeetingsForUserWhichTookPart(username: string): Promise<MeetingEntity[]>{
    username = username.toLowerCase();
    const bookings = await this.bookingRepository.find({
      where: {user: {username: username}, tookPart: true, deleted: false}
    });
    const meetingsIDs = bookings.map(booking => booking.mid);
    if(meetingsIDs.length == 0){
      return [];
    }
    return this.meetingRepository.find({
      where: {mid: In(meetingsIDs)}
    });
  }

  //these two functions (above and below) kind of do the same thing as in the old version weird?

  async getAttendingInformationForUser(username: string): Promise<BookingEntity[]>{
    username = username.toLowerCase();
    return this.bookingRepository.find({
      where: {user: {username: username}, tookPart: true, deleted: false}
    });
  }

  async getMeetingsFromAuthor(username: string, userID: string): Promise<MeetingEntity[]>{
    username = username.toLowerCase();
    const settings = await this.settingsService.findOne(username);
    if(username == userID || (settings && settings.summaryOfMeetingsVisible === true)){
      return this.meetingRepository.find({
        where: {username: username},
        relations: {comments: true}
      });
    } else {
      throw new ForbiddenException('Access Denied. Not allowed');
    }
  }

  getAllTags(): Promise<string[]> {
    return this.dataSource.createQueryBuilder()
    .select("distinct UNNEST(meeting.tags)", 't')
    .from(MeetingEntity, "meeting")
    .where("meeting.tags <> '{}'")
    .getRawMany().then( result => result ? result.map(r => r.t): [])
  }
}