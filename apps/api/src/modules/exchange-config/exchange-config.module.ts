import { Module } from '@nestjs/common';
import { ExchangeConfigController } from './exchange-config.controller';
import { ExchangeConfigService } from './exchange-config.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
    controllers: [ExchangeConfigController],
    providers: [ExchangeConfigService, PrismaService],
})
export class ExchangeConfigModule {}
