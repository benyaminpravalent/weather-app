import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OpenWeatherMapService {
  private readonly apiKey: string | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OPENWEATHERMAP_API_KEY');
    if (!this.apiKey) {
      throw new Error(
        'OPENWEATHERMAP_API_KEY is not set in the environment variables',
      );
    }
  }

  async getCurrentWeather(city: string): Promise<any> {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}`;
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch current weather: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getWeatherForecast(city: string): Promise<any> {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}`;
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch weather forecast: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
