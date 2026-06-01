import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class AwardXpDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
