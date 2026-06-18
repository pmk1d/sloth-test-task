import { Controller, Get } from '@nestjs/common';
import { ExchangeConfigService } from './exchange-config.service';

@Controller('api/exchange-config')
export class ExchangeConfigController {
    constructor(private readonly exchangeConfigService: ExchangeConfigService) {}

    @Get()
    findAll() {
        return this.exchangeConfigService.findAll();
    }
}
