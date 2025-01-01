import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AppLogger } from '../../shared/logger/logger.service';
// import { RequestContext } from '../../shared/request-context/request-context.dto';
import { CurrentWeatherResponse } from '../dtos/current-weather.dto';
import { WeatherForecastResponse } from '../dtos/weather-forecast.dto';
import { WeatherService } from '../services/weather.service';

/**
 * Weather Resolver
 * Provides GraphQL queries to get current weather and forecast data.
 */
@Resolver()
@UseGuards(JwtAuthGuard) // Require JWT authentication for all queries in this resolver
export class WeatherResolver {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(WeatherResolver.name);
  }

  /**
   * Get current weather for a given city.
   * Requires authentication via JWT.
   *
   * @param ctx Request context containing user info and request metadata.
   * @param cityName Name of the city to retrieve weather data for.
   * @returns Current weather data for the specified city.
   */
  @Query(() => CurrentWeatherResponse) // Replace `String` with your actual GraphQL return type
  async getCurrentWeather(
    @Args('cityName') cityName: string,
  ): Promise<CurrentWeatherResponse> {
    // this.logger.log(
    //   ctx,
    //   `getCurrentWeather query was called with cityName: ${cityName}`,
    // );
    return this.weatherService.getWeather(cityName);
  }

  /**
   * Get weather forecast for a given city.
   * Requires authentication via JWT.
   *
   * @param ctx Request context containing user info and request metadata.
   * @param cityName Name of the city to retrieve weather forecast for.
   * @returns Weather forecast data for the specified city.
   */
  @Query(() => WeatherForecastResponse) // Replace `String` with your actual GraphQL return type
  async getWeatherForecast(
    // @Context('ctx') ctx: RequestContext,
    @Args('cityName') cityName: string,
  ): Promise<WeatherForecastResponse> {
    // this.logger.log(
    //   ctx,
    //   `getWeatherForecast query was called with cityName: ${cityName}`,
    // );
    return this.weatherService.getForecast(cityName);
  }
}
