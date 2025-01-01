import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OpenWeatherMapService {
  private readonly apiKey: string | undefined;
  private readonly openWeatherMapUrl: string | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OPENWEATHERMAP_API_KEY');
    this.openWeatherMapUrl =
      this.configService.get<string>('OPENWEATHERMAP_URL');
  }

  async getCurrentWeather(city: string): Promise<any> {
    try {
      const url = `${this.openWeatherMapUrl}/weather?q=${city}&appid=${this.apiKey}`;
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
      const url = `${this.openWeatherMapUrl}/forecast?q=${city}&appid=${this.apiKey}`;
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
