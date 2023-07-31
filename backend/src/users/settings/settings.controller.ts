import { Controller, Get, Post, Body, Patch, Req, Put } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsDto } from '../dto/settings.dto';
import { EvendemyRequest } from 'src/core/evendemy-request';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  get(@Req() req: EvendemyRequest) {
    return this.settingsService.findOne(req.user.username);
  }

  @Put()
  update(@Req() req: EvendemyRequest, @Body() updateSettingDto: SettingsDto) {
    return this.settingsService.update(req.user.username, updateSettingDto);
  }

}
