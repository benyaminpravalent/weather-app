import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { Clouds } from './clouds.dto';
import { Wind } from './wind.dto';

@ObjectType()
export class Coordinate {
  @Field(() => Float)
  lon: number;

  @Field(() => Float)
  lat: number;
}

@ObjectType()
export class WeatherDescription {
  @Field(() => String)
  main: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  icon: string;
}

@ObjectType()
export class MainWeather {
  @Field(() => Float)
  temp: number;

  @Field(() => Float)
  feels_like: number;

  @Field(() => Float)
  temp_min: number;

  @Field(() => Float)
  temp_max: number;

  @Field(() => Int)
  pressure: number;

  @Field(() => Int)
  humidity: number;

  @Field(() => Int, { nullable: true })
  sea_level?: number;

  @Field(() => Int, { nullable: true })
  grnd_level?: number;
}

@ObjectType()
export class Sys {
  @Field(() => String)
  country: string;

  @Field(() => Int)
  sunrise: number;

  @Field(() => Int)
  sunset: number;
}

@ObjectType()
export class CurrentWeatherResponse {
  @Field(() => Coordinate)
  coord: Coordinate;

  @Field(() => [WeatherDescription])
  weather: WeatherDescription[];

  @Field(() => String)
  base: string;

  @Field(() => MainWeather)
  main: MainWeather;

  @Field(() => Int)
  visibility: number;

  @Field(() => Wind)
  wind: Wind;

  @Field(() => Clouds)
  clouds: Clouds;

  @Field(() => Int)
  dt: number;

  @Field(() => Sys)
  sys: Sys;

  @Field(() => Int)
  timezone: number;

  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  cod: number;
}
