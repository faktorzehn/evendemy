import { Action } from '@ngrx/store';
import { User } from '../model/user';

export const INIT_USERS = 'INIT_USERS';

export class InitUsers implements Action {
  readonly type = INIT_USERS;
  constructor(public payload: User[]) {}
}

export type UsersActions
  = InitUsers;
