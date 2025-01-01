import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateLocationInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  cityName: string;
}
