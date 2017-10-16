import { Action } from '@ngrx/store';
import { Meeting } from '../model/meeting';
import { Comment } from '../model/comment';

export const SELECT_MEETING = 'SELECT_MEETING';
export const UNSELECT_MEETING = 'UNSELECT_MEETING';
export const UPDATE_COMMENTS = 'UPDATE_COMMENTS';

export class SelectMeeting implements Action {
  readonly type = SELECT_MEETING;
  constructor(public payload: Meeting) {}
}

export class UnselectMeeting implements Action {
  readonly type = UNSELECT_MEETING;
}

export class UpdateComments implements Action {
  readonly type = UPDATE_COMMENTS;
  constructor(public payload: {mid: number, comments: Comment[]}) {}
}
