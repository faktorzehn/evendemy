import { usersReducer } from './users.reducer';
import { InitUsers } from '../actions/users.actions';
import { User } from '../model/user';

describe ('usersReducer', () => {

  it('should init users', () => {
    const users = [
      new User('john', 'mail', 'John', 'Doe'),
      new User('admin', 'mail2', 'Admin', 'Doe')
    ];
    expect(usersReducer([], new InitUsers(users))).toEqual(users);
  });

  it('default should return state', () => {
    const users = [
      new User('john', 'mail', 'John', 'Doe'),
      new User('admin', 'mail2', 'Admin', 'Doe')
    ];
    expect(usersReducer(users, { type: 'NOT_SUPPORTED' } as any)) //
    .toEqual(users);
  });

});
