import { MeetingUtil } from './meeting.util';
import * as moment from 'moment';
describe('MeetingUtil', () => {

  const FORMAT = 'DD.MM.YYYY';
  const TEST_DATE_AS_STRING = '28.02.2018';

  it('stringToDate should transfrom to moment date format', () => {
    const date = moment(TEST_DATE_AS_STRING, FORMAT);
    const result = MeetingUtil.stringToDate('28.2.2018');

    expect(date.isSame(result)).toBeTruthy();
  });

  it('stringToDate should transfrom "" to null', () => {
    expect(MeetingUtil.stringToDate('')).toBeNull();
  });

  it('dateToString should transfrom null to ""', () => {
    expect(MeetingUtil.dateToString(null)).toBe('');
  });

  it('dateToString should transfrom date to string', () => {
    const date = moment(TEST_DATE_AS_STRING, FORMAT).toDate();
    expect(MeetingUtil.dateToString(date)).toEqual(TEST_DATE_AS_STRING);
  });

  it('mapType should transform course to course', () => {
    expect(MeetingUtil.mapType('course')).toEqual('course');
  });

  it('mapType should transform event to event', () => {
    expect(MeetingUtil.mapType('event')).toEqual('event');
  });

  it('mapType should transform anything else to course', () => {
    expect(MeetingUtil.mapType('xyz')).toEqual('course');
  });

  it('generateCSV should generate empty csv', () => {
    const attendees = [];
    const users = [];
    const result = 'Firstname,Lastname,email,has taken part';

    expect(MeetingUtil.generateCSV(attendees, users)).toBe(result);
  });

  it('generateCSV should generate empty csv', () => {
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
