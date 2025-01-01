import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import { OpenWeatherMapService } from '../../shared/http-requests/open-weather-map.service';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { WEATHER } from '../constants/weather.constant';

@Injectable()
export class WeatherService {
  private readonly redis: Redis;
  constructor(
    private readonly logger: AppLogger,
    private readonly redisService: RedisService,
    private readonly openWeatherMapService: OpenWeatherMapService,
  ) {
    this.logger.setContext(WeatherService.name);
    this.redis = this.redisService.getOrThrow();
  }

  async getWeather(ctx: RequestContext, cityName: string): Promise<any> {
    this.logger.log(ctx, `${this.getWeather.name} was called`);

    const redisKey = `${WEATHER.WEATHER_CACHE_KEY}:${cityName.toLowerCase()}`;

    // Check Redis for cached data
    const cachedData = await this.redis.get(redisKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // If no cached data, fetch from OpenWeatherMap API
    const weatherData =
      await this.openWeatherMapService.getCurrentWeather(cityName);

    // Cache the fetched data in Redis
    await this.redis.set(
      redisKey,
      JSON.stringify(weatherData),
      'EX',
      WEATHER.CACHE_TTL,
    );

    return weatherData;
  }

  async getForecast(ctx: RequestContext, cityName: string): Promise<any> {
    this.logger.log(ctx, `${this.getForecast.name} was called`);

    const redisKey = `${WEATHER.FORECAST_CACHE_KEY}:${cityName.toLowerCase()}`;

    // Check Redis for cached data
    const cachedData = await this.redis.get(redisKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // If no cached data, fetch from OpenWeatherMap API
    const forecastData =
      await this.openWeatherMapService.getWeatherForecast(cityName);

    // Cache the fetched data in Redis
    await this.redis.set(
      redisKey,
      JSON.stringify(forecastData),
      'EX',
      WEATHER.CACHE_TTL,
    );

    return forecastData;
  }
}
