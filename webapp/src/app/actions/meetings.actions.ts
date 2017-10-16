import { Action } from '@ngrx/store';
import { Meeting } from '../model/meeting';

export const INIT_MEETINGS = 'INIT_MEETINGS';
export const ADD_MEETING = 'ADD_MEETING';
export const UPDATE_MEETING = 'UPDATE_MEETING';
export const REMOVE_MEETING = 'REMOVE_MEETING';
export const SELECT_MEETING = 'SELECT_MEETING';

export class InitMeetings implements Action {
  readonly type = INIT_MEETINGS;
  constructor(public payload: Meeting[]) {}
}

export class AddMeeting implements Action {
  readonly type = ADD_MEETING;
  constructor(public payload: Meeting) {}
}

export class UpdateMeeting implements Action {
  readonly type = UPDATE_MEETING;
  constructor(public payload: Meeting) {}
}

export class RemoveMeeting implements Action {
  readonly type = REMOVE_MEETING;
  constructor(public payload: number) {}
}

export type MeetingsActions
  = InitMeetings | AddMeeting | UpdateMeeting | RemoveMeeting;
