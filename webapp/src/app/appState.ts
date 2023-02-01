import { Meeting } from './model/meeting';
import { User } from './model/user';

export interface AppState {
  meetings: Meeting[];
  users: User[];
}
