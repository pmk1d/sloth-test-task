import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ExchangeConfigModule } from './modules/exchange-config/exchange-config.module';
import { RatesModule } from './modules/rates/rates.module';

@Module({
    imports: [UsersModule, ExchangeConfigModule, RatesModule],
})
export class AppModule {}
