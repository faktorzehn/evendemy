import { Meeting } from './model/meeting';

export interface AppState {
  meetings: Meeting[];
  selectMeeting: Meeting;
}
