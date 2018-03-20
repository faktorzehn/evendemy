import { Action } from '@ngrx/store';

import {SELECT_MEETING, UNSELECT_MEETING, UPDATE_COMMENTS,
  SelectMeeting, UnselectMeeting, UpdateComments} from '../actions/selectMeeting.actions';
import { User } from '../model/user';
import { InitUsers, INIT_USERS } from '../actions/users.actions';

export function usersReducer(state: User[] = [], action: InitUsers) {
  switch (action.type) {
    case INIT_USERS:
      return action.payload;
    default:
      return state;
  }
}
