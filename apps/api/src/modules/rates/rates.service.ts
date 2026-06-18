import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RatesService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        const rates = await this.prisma.rate.findMany();

        return rates.map((rate) => ({
            id: `${rate.base}_${rate.quote}`,
            base: rate.base,
            quote: rate.quote,
            tiers: rate.tiers,
            updatedAt: rate.updatedAt,
        }));
    }
}
