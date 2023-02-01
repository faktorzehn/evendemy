import { User } from '../model/user';
import { InitUsers, INIT_USERS } from '../actions/users.actions';

export function usersReducer(state: User[] = [], action: InitUsers) {
  switch (action.type) {
    case INIT_USERS:
      return [...action.payload];
    default:
      return state;
  }
}
