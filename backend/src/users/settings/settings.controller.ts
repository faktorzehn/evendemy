import { Controller, Get, Post, Body, Patch, Req, Put } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsDto } from '../dto/settings.dto';
import { EvendemyRequest } from 'src/shared/evendemy-request';
import { SettingsEntity } from '../entities/setting.entity';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  get(@Req() req: EvendemyRequest) {
    return this.settingsService.findOne(req.user. preferred_username).then(SettingsEntity.toDTO);
  }

  @Put()
  update(@Req() req: EvendemyRequest, @Body() updateSettingDto: SettingsDto) {
    return this.settingsService.update(req.user. preferred_username, updateSettingDto).then(SettingsEntity.toDTO);
  }

}
