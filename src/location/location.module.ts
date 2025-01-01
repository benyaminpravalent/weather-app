import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { SharedModule } from '../shared/shared.module';
import { LocationController } from './controllers/location.controller';
import { Location } from './entities/location.entity';
import { LocationRepository } from './repositories/location.repository';
import { LocationService } from './services/location.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Location])],
  providers: [LocationService, JwtAuthStrategy, LocationRepository],
  controllers: [LocationController],
  exports: [LocationService],
})
export class LocationModule {}
