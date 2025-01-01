import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { Clouds } from './clouds.dto';
import { Wind } from './wind.dto';

@ObjectType()
export class ForecastMain {
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

  @Field(() => Int, { nullable: true })
  sea_level?: number;

  @Field(() => Int, { nullable: true })
  grnd_level?: number;

  @Field(() => Int)
  humidity: number;

  @Field(() => Float, { nullable: true })
  temp_kf?: number;
}

@ObjectType()
export class ForecastWeatherDescription {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  main: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  icon: string;
}

@ObjectType()
export class ForecastSys {
  @Field(() => String)
  pod: string;
}

@ObjectType()
export class ForecastItem {
  @Field(() => Int)
  dt: number;

  @Field(() => ForecastMain)
  main: ForecastMain;

  @Field(() => [ForecastWeatherDescription])
  weather: ForecastWeatherDescription[];

  @Field(() => Clouds)
  clouds: Clouds;

  @Field(() => Wind)
  wind: Wind;

  @Field(() => Int, { nullable: true })
  visibility?: number;

  @Field(() => Float)
  pop: number;

  @Field(() => ForecastSys)
  sys: ForecastSys;

  @Field(() => String)
  dt_txt: string;
}

@ObjectType()
export class Coord {
  @Field(() => Float)
  lat: number;

  @Field(() => Float)
  lon: number;
}

@ObjectType()
export class City {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => Coord)
  coord: Coord;

  @Field(() => String)
  country: string;

  @Field(() => Int)
  population: number;

  @Field(() => Int)
  timezone: number;

  @Field(() => Int)
  sunrise: number;

  @Field(() => Int)
  sunset: number;
}

@ObjectType()
export class WeatherForecastResponse {
  @Field(() => String, { nullable: true })
  cod?: string;

  @Field(() => Int)
  message: number;

  @Field(() => Int)
  cnt: number;

  @Field(() => [ForecastItem])
  list: ForecastItem[];

  @Field(() => City)
  city: City;
}
