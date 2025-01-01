import { Args, Context, Query, Resolver } from '@nestjs/graphql';

import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { createRequestContext } from '../../shared/request-context/util';
import { CurrentWeatherResponse } from '../dtos/current-weather.dto';
import { WeatherForecastResponse } from '../dtos/weather-forecast.dto';
import { WeatherService } from '../services/weather.service';

/**
 * Weather Resolver
 * Provides GraphQL queries to get current weather and forecast data.
 */
@Resolver()
export class WeatherResolver {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(WeatherResolver.name);
  }

  /**
   * Get current weather for a given city.
   *
   * @param ctx Request context containing user info and request metadata.
   * @param cityName Name of the city to retrieve weather data for.
   * @returns Current weather data for the specified city.
   */
  @Query(() => CurrentWeatherResponse)
  async getCurrentWeather(
    @Context() context: any,
    @Args('cityName') cityName: string,
  ): Promise<CurrentWeatherResponse> {
    const req = context.req;
    const ctx: RequestContext = createRequestContext(req);

    this.logger.log(
      ctx,
      `getCurrentWeather query was called with cityName: ${cityName}`,
    );
    return this.weatherService.getWeather(ctx, cityName);
  }

  /**
   * Get weather forecast for a given city.
   *
   * @param ctx Request context containing user info and request metadata.
   * @param cityName Name of the city to retrieve weather forecast for.
   * @returns Weather forecast data for the specified city.
   */
  @Query(() => WeatherForecastResponse)
  async getWeatherForecast(
    @Context() context: any,
    @Args('cityName') cityName: string,
  ): Promise<WeatherForecastResponse> {
    const req = context.req;
    const ctx: RequestContext = createRequestContext(req);

    this.logger.log(
      ctx,
      `getWeatherForecast query was called with cityName: ${cityName}`,
    );
    return this.weatherService.getForecast(ctx, cityName);
  }
}
