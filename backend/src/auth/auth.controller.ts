import { Controller, Get, Logger, Post, Req } from '@nestjs/common';
import { EvendemyRequest } from 'src/shared/evendemy-request';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users/users.service';

@Controller('auth')
export class AuthController {

    private readonly logger = new Logger(AuthController.name);

    constructor(private usersService: UsersService) {}

    /**
     * Create a new account - if not already existing
     */
    @Post()
    async createNewAccount(@Req() req: EvendemyRequest) {
        try {
            await this.usersService.create({... req.user} as CreateUserDto);
            this.logger.log('user has logged in the first time...the account has been created');
        } catch(e) {
            this.logger.error(e);
            //user already exists - at the moment no update, maybe an other solution in the future
        }
        return true;
    }

    /**
     * Returns the current logged in user
     */
    @Get()
    getAuth(@Req() req: EvendemyRequest) {
      return this.usersService.findOne(req.user.username);
    }
}
