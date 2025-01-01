import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { CreateLocationInput } from '../dtos/create-location-input.dto';
import { LocationOutput } from '../dtos/location-output.dto';
import { LocationRepository } from '../repositories/location.repository';

@Injectable()
export class LocationService {
  constructor(
    private readonly repository: LocationRepository,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(LocationService.name);
  }

  /**
   * Add a location to the user's favorites.
   */
  async addLocation(
    ctx: RequestContext,
    input: CreateLocationInput,
  ): Promise<LocationOutput> {
    this.logger.log(ctx, `${this.addLocation.name} was called`);

    this.logger.log(ctx, `calling ${LocationRepository.name}.addLocation`);
    const savedLocation = await this.repository.addLocation(
      ctx.user!.id,
      input.cityName,
    );

    return plainToClass(LocationOutput, savedLocation, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Retrieve the user's favorite locations.
   */
  async getLocations(
    ctx: RequestContext,
    userId: number,
  ): Promise<LocationOutput[]> {
    this.logger.log(ctx, `${this.getLocations.name} was called`);

    this.logger.log(ctx, `calling ${LocationRepository.name}.getByUserId`);
    const locations = await this.repository.getByUserId(userId);

    return plainToClass(LocationOutput, locations, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Remove a location from the user's favorites.
   */
  async deleteLocation(ctx: RequestContext, id: number): Promise<void> {
    this.logger.log(ctx, `${this.deleteLocation.name} was called`);

    this.logger.log(ctx, `calling ${LocationRepository.name}.deleteById`);
    await this.repository.deleteById(id);
  }
}
