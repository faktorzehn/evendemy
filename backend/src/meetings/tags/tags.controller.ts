import { Controller, Get } from '@nestjs/common';
import { MeetingsService } from '../meetings.service';

@Controller('tags')
export class TagsController {

    constructor(private readonly meetingsService: MeetingsService) {}

    @Get()
    getAllTags() {
        return this.meetingsService.getAllTags();
    }
}
