import { Body, Controller, Delete, Get, Header, HttpException, HttpStatus, Param, Post, Put, Req } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { EvendemyRequest } from 'src/shared/evendemy-request';
import { ImageService } from 'src/core/image.service';
import { ConfigService } from '@nestjs/config';
import { ConfigTokens } from 'src/config.tokens';
import { UserEntity } from '../entities/user.entity';

@Controller('api/user')
export class UserController {

    private path = this.configService.get<string>(ConfigTokens.USER_IMAGE_FOLDER);

    constructor(private readonly usersService: UsersService, private imageService: ImageService, private configService: ConfigService) {}

    @Get(':username')
    getOneUser(@Param('username') username: string) {
        return this.usersService.findOne(username).then(UserEntity.toDTO);
    }

    @Post(':username/image')
    async saveUserImage(@Req() req: EvendemyRequest, @Param('username') username: string) {
        this.checkIfLoggedInUser(req, username);
        // TODO remove username from API path -not needed - only logged in user can change his/her own data
        var data = (req.body as any).data;
        if(!data) {
            throw new HttpException('No image', HttpStatus.NOT_ACCEPTABLE);
        }
        
        if(this.imageService.save(req.user. preferred_username, data, this.path)) {
            this.usersService.imageSaved(req.user. preferred_username, true);
        } else {
            throw new HttpException('Image could not be saved.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':username/image')
    @Header('Content-Type', 'image/jpeg')
    async getUserImage(@Req() req: EvendemyRequest, @Param('username') username: string) {
        var user = await this.usersService.findOne(username);
        if(user && user.avatar) {
            return this.imageService.read(username,this.path);
        }
        throw new HttpException("User has no Avatar", HttpStatus.NOT_FOUND);
    }

    @Delete(':username/image')
    deleteUserImage(@Req() req: EvendemyRequest, @Param('username') username: string) {
        this.checkIfLoggedInUser(req, username);
        // TODO remove username from API path -not needed - only logged in user can change his/her own data

        if(this.imageService.delete(req.user. preferred_username, this.path)) {
            this.usersService.imageSaved(req.user. preferred_username, false);
        } else {
            throw new HttpException('Image could not be saved.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put(':username/additional_info')
    saveAdditionalInfos(@Req() req: EvendemyRequest, @Body() dto: UpdateUserDto, @Param('username') username: string) {
        this.checkIfLoggedInUser(req, username);
        // TODO remove username from API path -not needed - only logged in user can change his/her own data
        return this.usersService.update(req.user. preferred_username, dto)
            .then( _ => this.usersService.findOne(req.user. preferred_username))
            .then(UserEntity.toDTO);
    }

    private checkIfLoggedInUser(req: EvendemyRequest, username: string) {
        if(username != req.user. preferred_username) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
    }
}
