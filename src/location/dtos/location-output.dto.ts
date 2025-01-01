import { Expose } from 'class-transformer';

export class LocationOutput {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  cityName: string;

  @Expose()
  createdAt: Date;
}
