import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LocationOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  userId: number;

  @Expose()
  @ApiProperty()
  cityName: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;
}
