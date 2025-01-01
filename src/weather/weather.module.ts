import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { SharedModule } from '../shared/shared.module';
import { WeatherResolver } from './resolvers/weather.resolver';
import { WeatherService } from './services/weather.service';

@Module({
  imports: [SharedModule, HttpModule],
  providers: [WeatherService, WeatherResolver],
  exports: [WeatherService],
})
export class WeatherModule {}
