
import { NestMiddleware } from '@nestjs/common';
import * as path from 'path'

export class UIMiddleWare implements NestMiddleware {
    use(_req,res,_next) {
            res.sendFile("idk.html") // Somehow send the webapps index.html
        }
    }
}