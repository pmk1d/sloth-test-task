import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
    const mockDir = path.join(__dirname, '..', 'mock');

    const userRaw = JSON.parse(
        fs.readFileSync(path.join(mockDir, 'GET_users_me.json'), 'utf-8'),
    );

    await prisma.user.upsert({
        where: { id: userRaw.id },
        update: {},
        create: {
            id: userRaw.id,
            firstName: userRaw.firstName,
            lastName: userRaw.lastName,
        },
    });

    const configs = JSON.parse(
        fs.readFileSync(path.join(mockDir, 'GET_exchange-config.json'), 'utf-8'),
    );

    for (const cfg of configs) {
        await prisma.exchangeConfig.upsert({
            where: { id: cfg.id },
            update: {},
            create: {
                id: cfg.id,
                fromCurrency: cfg.fromCurrency,
                toCurrency: cfg.toCurrency,
                rateBase: cfg.rateBase,
                rateQuote: cfg.rateQuote,
                paymentMethods: cfg.paymentMethods,
                receivePlatforms: cfg.receivePlatforms,
                minAmount: cfg.minAmount,
                sortOrder: cfg.sortOrder,
            },
        });
    }

    const rates = JSON.parse(
        fs.readFileSync(path.join(mockDir, 'GET_rates.json'), 'utf-8'),
    );

    for (const rate of rates) {
        await prisma.rate.upsert({
            where: { base_quote: { base: rate.base, quote: rate.quote } },
            update: { tiers: rate.tiers },
            create: {
                base: rate.base,
                quote: rate.quote,
                tiers: rate.tiers,
            },
        });
    }

    console.log('Seed complete');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
