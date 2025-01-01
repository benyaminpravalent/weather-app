import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { plainToClass } from 'class-transformer';
import { Redis } from 'ioredis';

import { OpenWeatherMapService } from '../../shared/http-requests/open-weather-map.service';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { WEATHER } from '../../weather/constants/weather.constant';
import { CreateLocationInput } from '../dtos/create-location-input.dto';
import { LocationOutput } from '../dtos/location-output.dto';
import { LocationRepository } from '../repositories/location.repository';

@Injectable()
export class LocationService {
  private readonly redis: Redis;
  constructor(
    private readonly repository: LocationRepository,
    private readonly logger: AppLogger,
    private readonly redisService: RedisService,
    private readonly openWeatherMapService: OpenWeatherMapService,
  ) {
    this.logger.setContext(LocationService.name);
    this.redis = this.redisService.getOrThrow();
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

  /**
   * Cron job to update weather data every hour.
   */
  @Cron('0 * * * *') // Runs every hour at the start of the hour
  async handleCron(): Promise<void> {
    const ctx: RequestContext = {
      user: null,
      requestID: 'cron-job',
      url: '/cron',
    };
    this.logger.log(ctx, 'Cron job started: Updating weather data');
    try {
      await this.updateWeatherData(ctx);
      this.logger.log(ctx, 'Weather data successfully updated');
    } catch (error) {
      this.logger.error(ctx, `Error during weather data update = ${error}`);
    }
  }

  /**
   * Fetch distinct cities, get weather and forecast data, and store it in Redis with TTL 1 hour.
   */
  async updateWeatherData(ctx: RequestContext): Promise<void> {
    this.logger.log(ctx, `${this.updateWeatherData.name} was called`);

    // Fetch all distinct cities from the locations table
    this.logger.log(
      ctx,
      `calling ${LocationRepository.name}.getAllDistinctCities`,
    );
    const cities = await this.repository.getAllDistinctCities();

    for (const city of cities) {
      try {
        this.logger.log(ctx, `Fetching weather data for city: ${city}`);
        const currentWeather =
          await this.openWeatherMapService.getCurrentWeather(city);
        const weatherForecast =
          await this.openWeatherMapService.getWeatherForecast(city);

        // Store weather data in Redis with a TTL of 1 hour
        const weatherRedisKey = `${WEATHER.WEATHER_CACHE_KEY}:${city}`;
        await this.redis.set(
          weatherRedisKey,
          JSON.stringify(currentWeather),
          'EX',
          WEATHER.CACHE_TTL,
        );

        const forecastRedisKey = `${WEATHER.FORECAST_CACHE_KEY}:${city}`;
        await this.redis.set(
          forecastRedisKey,
          JSON.stringify(weatherForecast),
          'EX',
          WEATHER.CACHE_TTL,
        );

        this.logger.log(
          ctx,
          `Weather data for city ${city} stored in Redis with TTL 1 hour`,
        );
      } catch (error) {
        this.logger.error(
          ctx,
          `Failed to fetch or store weather data for city ${city}: ${error}`,
        );
      }
    }
  }
}
