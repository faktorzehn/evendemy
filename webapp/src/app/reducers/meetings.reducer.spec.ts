
import { meetingsReducer } from './meetings.reducer';
import {InitMeetings, AddMeeting, RemoveMeeting, UpdateMeeting} from '../actions/meetings.actions';
import { Meeting } from '../model/meeting';

describe ('meetingsReducer', () => {

  function createMeeting(mid: number, title: string, username: string) {
    const meeting = new Meeting();
    meeting.mid = mid;
    meeting.title = title;
    meeting.username = username;
    return meeting;
  }

  describe('InitMeetings', () => {
    it('should create []', () => {
      expect(meetingsReducer([], new InitMeetings([]))).toEqual([]);
    });

    it('should create 2 meetings', () => {
      const meetings = [];
      meetings.push(createMeeting(1, 'Test-Meeting-1', 'john'));
      meetings.push(createMeeting(2, 'Test-Meeting-2', 'admin'));
      expect(meetingsReducer([], new InitMeetings(meetings))).toEqual(meetings);
    });
  });

  describe('AddMeeting', () => {
    it('should add one meeting', () => {
      const meeting = createMeeting(1, 'Test-Meeting-1', 'john');
      expect(meetingsReducer([], new AddMeeting(meeting))).toEqual([meeting]);
    });
  });

  describe('RemoveMeeting', () => {
    it('should remove first meeting', () => {
      const meeting1 = createMeeting(1, 'Test-Meeting-1', 'john');
      const meeting2 = createMeeting(2, 'Test-Meeting-2', 'admin');
      const meeting3 = createMeeting(3, 'Test-Meeting-3', 'max');
      expect(meetingsReducer([meeting1, meeting2, meeting3], new RemoveMeeting(1))).toEqual([meeting2, meeting3]);
    });

    it('should remove second meeting', () => {
      const meeting1 = createMeeting(1, 'Test-Meeting-1', 'john');
      const meeting2 = createMeeting(2, 'Test-Meeting-2', 'admin');
      const meeting3 = createMeeting(3, 'Test-Meeting-3', 'max');
      expect(meetingsReducer([meeting1, meeting2, meeting3], new RemoveMeeting(2))).toEqual([meeting1, meeting3]);
    });

    it('should remove last meeting', () => {
      const meeting1 = createMeeting(1, 'Test-Meeting-1', 'john');
      const meeting2 = createMeeting(2, 'Test-Meeting-2', 'admin');
      const meeting3 = createMeeting(3, 'Test-Meeting-3', 'max');
      expect(meetingsReducer([meeting1, meeting2, meeting3], new RemoveMeeting(3))).toEqual([meeting1, meeting2]);
    });
  });

  describe('UpdateMeeting', () => {
    it('should update first meeting', () => {
      const meeting1 = createMeeting(1, 'Test-Meeting-1', 'john');
      const meeting2 = createMeeting(2, 'Test-Meeting-2', 'admin');
      const meeting3 = createMeeting(3, 'Test-Meeting-3', 'max');
      const updatedMeeting = createMeeting(1, 'UPDATED_TITLE', 'UPDATED_USER');
      expect(meetingsReducer([meeting1, meeting2, meeting3], new UpdateMeeting(updatedMeeting))) //
      .toEqual([updatedMeeting, meeting2, meeting3]);
    });

    it('should update second meeting', () => {
      const meeting1 = createMeeting(1, 'Test-Meeting-1', 'john');
      const meeting2 = createMeeting(2, 'Test-Meeting-2', 'admin');
      const meeting3 = createMeeting(3, 'Test-Meeting-3', 'max');
      const updatedMeeting = createMeeting(2, 'UPDATED_TITLE', 'UPDATED_USER');
      expect(meetingsReducer([meeting1, meeting2, meeting3], new UpdateMeeting(updatedMeeting))) //
      .toEqual([meeting1, updatedMeeting, meeting3]);
    });

    it('should update last meeting', () => {
      const meeting1 = createMeeting(1, 'Test-Meeting-1', 'john');
      const meeting2 = createMeeting(2, 'Test-Meeting-2', 'admin');
      const meeting3 = createMeeting(3, 'Test-Meeting-3', 'max');
      const updatedMeeting = createMeeting(3, 'UPDATED_TITLE', 'UPDATED_USER');
      expect(meetingsReducer([meeting1, meeting2, meeting3], new UpdateMeeting(updatedMeeting))) //
      .toEqual([meeting1, meeting2, updatedMeeting]);
    });
  });

});
