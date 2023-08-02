
import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as path from 'path'

const allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
  ];

// Function for getting files from the root of webapp 
const resolvePath = (file: string) => path.resolve(`../webapp/dist/${file}`)

export class UIMiddleWare implements NestMiddleware {
    use(req: Request,res: Response,_next:NextFunction) {
        const { url } = req;
        if(allowedExt.filter(ext => url.indexOf(ext) > 0).length > 0) {
            res.sendFile(resolvePath(url))
        } else {
            res.sendFile(resolvePath("index.html"))
        }
    }
}