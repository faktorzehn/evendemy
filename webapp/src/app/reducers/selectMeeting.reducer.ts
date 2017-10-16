import { Action } from '@ngrx/store';

import { Meeting } from '../model/meeting';
import { Comment } from '../model/comment';
import {SELECT_MEETING, UNSELECT_MEETING, UPDATE_COMMENTS,
  SelectMeeting, UnselectMeeting, UpdateComments} from '../actions/selectMeeting.actions';

export function selectMeetingReducer(state: Meeting = null, action: SelectMeeting | UnselectMeeting | UpdateComments) {
  switch (action.type) {
    case SELECT_MEETING:
      return action.payload;
    case UNSELECT_MEETING:
      return null;
    case UPDATE_COMMENTS:
      {
        if (state) {
          state = Object.assign({}, state, {comments: action.payload.comments}) as Meeting;
        }
        return state;
      }
    default:
      return state;
  }
}
