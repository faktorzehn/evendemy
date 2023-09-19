import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigTokens } from 'src/config.tokens';

@Controller('api/config')
export class WebConfigController {

    constructor(private configService: ConfigService){}

    @Get()
    getConfig() {
        return {
            "backend_url": "http://localhost:8080/api",
            "usage_notice": "Evendemy is an open source project.<br/>It is licensed under the GPL-3.0 license. Details and the source code can be found at: https://github.com/faktorzehn/evendemy",
            "kc_client_id": this.configService.get<String>(ConfigTokens.KC_CLIENT_ID),
            "kc_url": this.configService.get<String>(ConfigTokens.KC_URL),
            "kc_realm": this.configService.get<String>(ConfigTokens.KC_REALM)       
        }
    }
}
