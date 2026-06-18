import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExchangeConfigService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        return this.prisma.exchangeConfig.findMany({
            orderBy: { sortOrder: 'asc' },
        });
    }
}
