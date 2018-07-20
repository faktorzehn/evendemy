import { Action } from '@ngrx/store';

import { Meeting } from '../model/meeting';
import {MeetingsActions, ADD_MEETING, UPDATE_MEETING, REMOVE_MEETING, INIT_MEETINGS} from '../actions/meetings.actions';

export function meetingsReducer(state: Meeting[] = [], action: MeetingsActions) {
  switch (action.type) {
    case INIT_MEETINGS:
      return [...action.payload];
    case ADD_MEETING:
      return [...state, action.payload].sort(Meeting.sortByDate);
    case UPDATE_MEETING:
      {
        const newState = [...state];
        const index = newState.findIndex(m => m.mid === action.payload.mid);
        newState[index] = action.payload;
        return newState;
      }
    case REMOVE_MEETING:
      return state.filter( m => m.mid !== action.payload);
    default:
      return state;
  }
}
