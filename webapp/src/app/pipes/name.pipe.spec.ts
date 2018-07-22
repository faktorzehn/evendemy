import { NamePipe } from './name.pipe';
import { User } from '../model/user';

describe('NamePipe', () => {
  it('null should return ""', () => {
    const pipe = new NamePipe();
    expect(pipe.transform(null)).toBe('');
  });

  it('undefined should return ""', () => {
    const pipe = new NamePipe();
    expect(pipe.transform(undefined)).toBe('');
  });

  it('only firstname should return ""', () => {
    const pipe = new NamePipe();
    const user: User = {
      firstname: 'John'
    } as User;
    expect(pipe.transform(user)).toBe('');
  });

  it('only lastname should return ""', () => {
    const pipe = new NamePipe();
    const user: User = {
      lastname: 'Doe'
    } as User;
    expect(pipe.transform(user)).toBe('');
  });

  it('user should return "John Doe"', () => {
    const pipe = new NamePipe();
    const user: User = {
      firstname: 'John',
      lastname: 'Doe'
    } as User;
    expect(pipe.transform(user)).toBe('John Doe');
  });
});
