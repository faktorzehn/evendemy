
import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as path from 'path'

export class UIMiddleWare implements NestMiddleware {
    use(_req: Request,res: Response,_next:NextFunction) {
            res.sendFile("idk.html"); // Somehow send the webapps index.html
    }
}