import { Injectable } from '@nestjs/common';
import { SettingsDto } from '../dto/settings.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingsEntity } from '../../users/entities/setting.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class SettingsService {

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(SettingsEntity)
    private settingsRepository: Repository<SettingsEntity>,
  ) {}

  findOne(username: string): Promise<SettingsEntity> {
    return this.usersRepository.find({ relations: {
      settings: true
    }, where: { username: username, deleted: false}, take: 1}).then( u => u[0] ? u[0].settings: undefined);
  }

  async update(username: string, dto: SettingsDto): Promise<SettingsEntity> {
    const user = await this.usersRepository.find({ relations: {
      settings: true
    }, where: { username: username, deleted: false}, take: 1}).then(u => u[0]);

    /*  because of security reasons settings are not managed by cascading - 
        therefore they need to be managed by ourselves
    */
    if(!user.settings) {
      user.settings = await this.create(username, dto);
      await this.usersRepository.save(user);
    } else {
      await this.updateExisting(user.settings, dto);
    }
    
    return Promise.resolve(user.settings);
  }

  private updateExisting(settings: SettingsEntity, dto: SettingsDto) {
    settings.summaryOfMeetingsVisible = dto.summary_of_meetings_visible;
    return this.settingsRepository.save(settings);
  }

  private create(username: string, dto: SettingsDto) {
    const settings = this.settingsRepository.create();

    settings.summaryOfMeetingsVisible = dto.summary_of_meetings_visible;
    return this.settingsRepository.save(settings);
  }
}
