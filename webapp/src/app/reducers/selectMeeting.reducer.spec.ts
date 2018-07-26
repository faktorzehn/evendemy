import { selectMeetingReducer } from './selectMeeting.reducer';
import { SelectMeeting, UnselectMeeting, UpdateComments } from '../actions/selectMeeting.actions';
import { Meeting } from '../model/meeting';
import { Comment } from '../model/comment';

describe ('selectMeetingReducer', () => {

  function createMeeting(mid: number, title: string, username: string) {
    const meeting = new Meeting();
    meeting.mid = mid;
    meeting.title = title;
    meeting.username = username;
    return meeting;
  }

  describe('SelectMeeting', () => {
    it('should return meeting', () => {
      const meeting = createMeeting(1, 'TITLE', 'USER');
      expect(selectMeetingReducer(null, new SelectMeeting(meeting))).toBe(meeting);
    });

    it('should return null', () => {
      const meeting = createMeeting(1, 'TITLE', 'USER');
      expect(selectMeetingReducer(meeting, new SelectMeeting(null))).toBe(null);
    });
  });

  describe('UnselectMeeting', () => {
    it('should return null', () => {
      const meeting = createMeeting(1, 'TITLE', 'USER');
      expect(selectMeetingReducer(meeting, new UnselectMeeting())).toBe(null);
    });
  });

  describe('UpdateComments', () => {
    it('should update comments', () => {
      const meeting = createMeeting(1, 'TITLE', 'USER');
      const comments: Comment[] = [{author: 'admin', text: 'test', creationDate: null}];

      const result = selectMeetingReducer(meeting, new UpdateComments({ mid: 1, comments: comments}));
      expect(result.comments).toEqual(comments);
    });
  });

});
