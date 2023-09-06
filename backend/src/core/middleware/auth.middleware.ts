import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as auth from '../../../plugins/auth';

/**
 * Middleware that should call the auth.js to authentificate/check the request.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  auth = auth({});

  allowedUrls = [];

  use(req: Request, res: Response, next: NextFunction) {
    next();
    // if(this.allowedUrls.includes(req.baseUrl)) {
    // } else {
    //   this.auth(req, res, next);
    // }
  }

}
