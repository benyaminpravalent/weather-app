import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { SharedModule } from '../shared/shared.module';
import { WeatherResolver } from './resolvers/weather.resolver';
import { WeatherService } from './services/weather.service';

@Module({
  imports: [SharedModule, HttpModule],
  providers: [WeatherService, WeatherResolver, JwtAuthStrategy],
  exports: [WeatherService],
})
export class WeatherModule {}
