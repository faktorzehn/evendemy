import { Controller, Get, Logger, Post, Req } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
import { EvendemyRequest } from 'src/shared/evendemy-request';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users/users.service';

@Controller('auth')
export class AuthController {

    private readonly logger = new Logger(AuthController.name);

    constructor(private usersService: UsersService) {}

    /**
     * Returns the current logged in user
     */
    @Get()
    @Unprotected()
    getAuth(@Req() req: EvendemyRequest) {
      return this.usersService.findOne(req.user. preferred_username);
    }
}
