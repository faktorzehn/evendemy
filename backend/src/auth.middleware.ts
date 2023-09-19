import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { ConfigTokens } from './config.tokens';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private configService: ConfigService){}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.header('Authorization');
    if( authHeader ) {
        this.auth(authHeader)
        .then((response) => response.json())
        .then( data => {
            (req as any).user = data;
            next();
        }).catch( err => {
            next(new HttpException('Not authorized', HttpStatus.UNAUTHORIZED));
        });
    } else  {
        next(new HttpException('Authorization header is required', HttpStatus.UNAUTHORIZED));
    }

  }

  private auth(token: string) {
    const baseURL = this.configService.get(ConfigTokens.KC_URL);
    const realm = this.configService.get(ConfigTokens.KC_REALM);
    const url = `${baseURL}/realms/${realm}/protocol/openid-connect/userinfo`;

    return fetch(url, { headers: {
        authorization: token,
    }});
  }
}
