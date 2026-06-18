import { Module } from '@nestjs/common';
import { RatesController } from './rates.controller';
import { RatesService } from './rates.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
    controllers: [RatesController],
    providers: [RatesService, PrismaService],
})
export class RatesModule {}
