import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find({ where: { deleted: false }});
  }

  findOne(username: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ username: username, deleted: false });
  }

  update(username: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(username, updateUserDto);
  }

  findByUsername(usernames: string[]): Promise<UserEntity[]> {
    return this.usersRepository.find({
      where: { username: In(usernames), deleted: false },
    });
  }

  async imageSaved(username: string, imageSaved: boolean) {
    const user = await this.findOne(username);
    user.avatar = imageSaved;
    return this.usersRepository.save(user);
  }

  async deactivate(username: string) {
    const user = await this.findOne(username);
    if(user) {
      user.deleted = true;
    }
    return this.usersRepository.save(user);
  }
}
