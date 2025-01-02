import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateLocationInput {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  cityName: string;
}
