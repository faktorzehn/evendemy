import { Injectable, Logger } from '@nestjs/common';
import { MeetingEntity } from './entities/meeting.entity';
import { UsersService } from 'src/users/users/users.service';
import { ConfigService } from '@nestjs/config';
import { ConfigTokens } from 'src/config.tokens';
import * as mustache from 'mustache';
import * as mailConfig from '../../assets/mail.json';
import { UserEntity } from 'src/users/entities/user.entity';
import { readFileSync } from 'fs';
import * as nodemailer from 'nodemailer';
import { CommentEntity } from './entities/comment.entity';
import { BookingEntity } from './entities/booking.entity';


class MailParts {
      header: string;
      title: string;
      body: string;
      button_href: string;
      button_label: string;
      foot: string;
}

@Injectable()
export class NotificationAboutMeetingsService {

  private readonly logger = new Logger(NotificationAboutMeetingsService.name);

  constructor(
    private configService: ConfigService, 
    private usersService: UsersService) { }

  async newMeeting(meeting: MeetingEntity): Promise<MeetingEntity> {
    if (!this.configService.get(ConfigTokens.MAIL_ENABLED)) {
      this.logger.warn("Mail is not enabled!");
      return Promise.resolve(meeting);
    }

    const users = await this.usersService.findAll();
    const mailAdresses = users.map(u => u.email);

    var parts = this.renderParts(meeting.isIdea ? mailConfig.informAboutIdea : mailConfig.informAboutMeeting, meeting, null, null);
    var html = this.renderMail(parts);

    return this.sendMail(mailAdresses, parts.title, html).then(_ => meeting);
  }

  async deletedMeeting(meeting: MeetingEntity, bookings: BookingEntity[]): Promise<MeetingEntity> {
    if (!this.configService.get(ConfigTokens.MAIL_ENABLED)) {
      return Promise.reject('mail service is not enabled');
    }
    const mailAdresses = bookings.map(u => u.user.email);
    var parts = this.renderParts(meeting.isIdea ? mailConfig.ideaDeleted : mailConfig.meetingDeleted, meeting, null, null);
    var html = this.renderMail(parts);
    return this.sendMail(mailAdresses, parts.title, html).then(_ => meeting);
  }

  private sendMail(mailAdresses: string[], title: string, mail: string, attachment?: any) {
    var smtpConfig = {
      host: this.configService.get(ConfigTokens.MAIL_HOST),
      port: this.configService.get(ConfigTokens.MAIL_PORT),
      secureConnection: false,
      auth: {
        user: this.configService.get(ConfigTokens.MAIL_USERNAME),
        pass: this.configService.get(ConfigTokens.MAIL_PASSWORD)
      },
      tls: {
        ciphers: 'SSLv3'
      }
    };

    var transporter = nodemailer.createTransport(smtpConfig);

    var mailOptions = {
      from: this.configService.get(ConfigTokens.MAIL_ADDRESS), // sender address
      bcc: mailAdresses, // list of receivers
      subject: title, // Subject line
      html: mail
    };

    if (attachment) {
      mailOptions['attachments'] = attachment;
    }

    // send mail with defined transport object
    return transporter.sendMail(mailOptions);
  }

  async newComment(meeting: MeetingEntity, comment: CommentEntity, bookings: BookingEntity[]): Promise<MeetingEntity> {
    if (!this.configService.get(ConfigTokens.MAIL_ENABLED)) {
      this.logger.warn("Mail is not enabled!");
      return Promise.resolve(meeting);
    }
    const attendeeEmails = bookings.filter(att => att.user.username !== comment._user.username).map(att => att.user.email);
    const parts = this.renderParts(
      mailConfig.commentAddedToMeeting,
      meeting,
      comment._user,
      comment.text
    );
    const html = this.renderMail(parts);
    return this.sendMail(attendeeEmails, parts.title, html).then(_ => meeting);
  }
  
  async timeChanged(meeting: MeetingEntity, bookings: BookingEntity[], ical: any): Promise<MeetingEntity>{
    if (!this.configService.get(ConfigTokens.MAIL_ENABLED)) {
      this.logger.warn("Mail is not enabled!");
      return Promise.resolve(meeting);
    }
    const creatorUsername = meeting.username;
    const creator = await this.usersService.findOne(creatorUsername);
    const attendeeEmails = bookings.filter(att => att.user.username !== meeting.username).map(att => att.user.email);
    const parts = this.renderParts(
      meeting.isIdea ? mailConfig.dateChangedFromMeeting : mailConfig.dateChangedFromIdea,
      meeting,
      creator,
      null
    );
    var html = this.renderMail(parts);
    return this.sendMail(attendeeEmails, parts.title, html, ical).then(_ => meeting);
  }

  async locationChanged(meeting: MeetingEntity, bookings: BookingEntity[]): Promise<MeetingEntity>{
    if (!this.configService.get(ConfigTokens.MAIL_ENABLED)) {
      this.logger.warn("Mail is not enabled!");
      return Promise.resolve(meeting);
    }
    const creatorUsername = meeting.username;
    const creator = await this.usersService.findOne(creatorUsername);
    const attendeeEmails = bookings.filter(att => att.user.username !== meeting.username).map(att => att.user.email);
    const parts = this.renderParts(
      meeting.isIdea ? mailConfig.locationChangedFromMeeting : mailConfig.locationChangedFromMeeting,
      meeting,
      creator, 
      null
    );
    var html = this.renderMail(parts);
    return this.sendMail(attendeeEmails, parts.title, html).then(_ => meeting);
  }

  async notifyUserAboutBooking(user: UserEntity, meeting: MeetingEntity): Promise<MeetingEntity>{
    if (!this.configService.get(ConfigTokens.MAIL_ENABLED)) {
        this.logger.warn("Mail is not enabled!");
        return Promise.resolve(meeting);
    }
    const parts = this.renderParts(
      meeting.isIdea ? mailConfig.notificationMail.ideaParticipationRejected : mailConfig.notificationMail.meetingParticipationRejected, 
      meeting, 
      user, 
      null
    );
    const html = this.renderMail(parts);
    return this.sendMail([user.email], parts.title, html).then(_ => meeting);
  }

  async notifyAuthorAboutBooking(isNewAttendee: boolean, meeting: MeetingEntity, attendee: UserEntity): Promise<void>{
    if (!this.configService.get(ConfigTokens.MAIL_ENABLED)) {
      this.logger.warn("Mail is not enabled!");
      return;
    }
    let template;
    if (isNewAttendee){
      template = meeting.isIdea ? mailConfig.notificationMail.newAttendeeForIdea : mailConfig.notificationMail.newAttendeeForMeeting;
    } else {
      template = meeting.isIdea ? mailConfig.notificationMail.canceledAttendeeForIdea : mailConfig.notificationMail.canceledAttendeeForMeeting;
    }
    const parts = this.renderParts(
      template,
      meeting,
      attendee,
      null
    );
    const html = this.renderMail(parts);
    const author = await this.usersService.findOne(attendee.username);
    if (author){
      return this.sendMail([author.email], parts.title, html).then(() => {});
    }
  }

  private renderParts(template: any, meeting?: MeetingEntity, user?: UserEntity, text?: string): MailParts {
    return {
      header: this.renderString(template.header, meeting, user, text),
      title: this.renderString(template.title, meeting, user, text),
      body: this.renderString(template.body, meeting, user, text),
      button_href: this.renderString(template.button_href, meeting, user, text),
      button_label: this.renderString(template.button_label, meeting, user, text),
      foot: this.renderString(template.foot, meeting, user, text)
    };
  }

  private renderMail(parts: MailParts) {
    var html = readFileSync('./assets/mail.html', 'utf8');//'../../assets/mail.html', 'utf8');
    return mustache.render(html, parts);
  }

  private renderString(template: any, meeting?: MeetingEntity, user?: UserEntity, text?: string): string {
    return mustache.render(template, { meeting, user, text });
  }
}