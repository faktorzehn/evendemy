import { MeetingUtil } from './meeting.util';
import * as moment from 'moment';
import { AttendeeStatus } from '../../../components/attendee-status/attendee-status.component';
import { Meeting } from '../../../model/meeting';
describe('MeetingUtil', () => {

  const FORMAT = 'DD.MM.YYYY';
  const TEST_DATE_AS_STRING = '28.02.2018';

  describe('stringToDate', () => {
    it('should transfrom to moment date format', () => {
      const date = moment(TEST_DATE_AS_STRING, FORMAT);
      const result = MeetingUtil.stringToDate('28.2.2018');

      expect(date.isSame(result)).toBeTruthy();
    });

    it('should transfrom "" to null', () => {
      expect(MeetingUtil.stringToDate('')).toBeNull();
    });
  });

  describe('dateToString', () => {
    it('should transfrom null to ""', () => {
      expect(MeetingUtil.dateToString(null)).toBe('');
    });

    it('should transfrom date to string', () => {
      const date = moment(TEST_DATE_AS_STRING, FORMAT).toDate();
      expect(MeetingUtil.dateToString(date)).toEqual(TEST_DATE_AS_STRING);
    });
  });

  describe('mapType', () => {
    it('should transform course to course', () => {
      expect(MeetingUtil.mapType('course')).toEqual('course');
    });

    it('should transform event to event', () => {
      expect(MeetingUtil.mapType('event')).toEqual('event');
    });

    it('should transform anything else to course', () => {
      expect(MeetingUtil.mapType('xyz')).toEqual('event');
    });
  });

  describe('mapStatus', () => {
    it('should transform isNew to INVALID', () => {
      expect(MeetingUtil.mapStatus(true, null, null)).toEqual(AttendeeStatus.INVALID);
    });

    it('should transform anything to ATTENDING', () => {
      expect(MeetingUtil.mapStatus(false, true, false)).toEqual(AttendeeStatus.ATTENDING);
    });

    it('should transform anything to CONFIRMED', () => {
      expect(MeetingUtil.mapStatus(false, false, true)).toEqual(AttendeeStatus.CONFIRMED);
    });

    it('should transform anything to NOT_ATTENDING', () => {
      expect(MeetingUtil.mapStatus(null, null, null)).toEqual(AttendeeStatus.NOT_ATTENDING);
    });
  });

  describe('generateCSV', () => {
    it('should generate empty csv', () => {
      const attendees = [];
      const users = [];
      const result = 'Firstname,Lastname,email,has taken part';

      expect(MeetingUtil.generateCSV(attendees, users)).toBe(result);
    });

    it('should generate empty csv', () => {
      const attendees = [
        {username: 'a', tookPart: true, mid: 1, externals: []},
        {username: 'b', tookPart: false, mid: 1, externals: []}
      ];

      const users = [
        {username: 'a', firstname: 'af', lastname: 'al', email: 'ae'},
        {username: 'b', firstname: 'bf', lastname: 'bl', email: 'be'}
      ];

      const result = 'Firstname,Lastname,email,has taken part\naf,al,ae,true\nbf,bl,be,false';

      expect(MeetingUtil.generateCSV(attendees, users)).toEqual(result);
    });

  });

  describe('hasValidDateAndTime', () => {
    it('should be true', () => {
      const m = new Meeting();
      m.startTime = moment().toDate();
      m.endTime = moment().toDate();
      expect(MeetingUtil.hasValidDateAndTime(m)).toBeTruthy();
    });

    it('should be false, no start time', () => {
      const m = new Meeting();
      m.endTime = moment().toDate();
      expect(MeetingUtil.hasValidDateAndTime(m)).toBeFalsy();
    });

    it('should be false, no end time', () => {
      const m = new Meeting();
      m.startTime = moment().toDate();
      expect(MeetingUtil.hasValidDateAndTime(m)).toBeFalsy();
    });
  });

  describe('isInThePast', () => {
    it('should be false', () => {
      const m = new Meeting();
      m.startTime = moment().toDate();
      expect(MeetingUtil.isInThePast(m)).toBeFalsy();
    });

    it('should be true', () => {
      const m = new Meeting();
      m.startTime = moment().subtract(1, 'day').toDate();
      expect(MeetingUtil.isInThePast(m)).toBeTruthy();
    });
  });

  describe('hasValidDate', () => {
    it('should be false', () => {
      const m = new Meeting();
      m.startTime = moment().add(1, 'day').toDate();
      expect(MeetingUtil.isInThePastOrToday(m)).toBeFalsy();
    });

    it('should be true because its today', () => {
      const m = new Meeting();
      m.startTime = moment().toDate();
      expect(MeetingUtil.isInThePastOrToday(m)).toBeTruthy();
    });

    it('should be true because its yesterday', () => {
      const m = new Meeting();
      m.startTime = moment().subtract(1, 'day').toDate();
      expect(MeetingUtil.isInThePastOrToday(m)).toBeTruthy();
    });
  });

});
