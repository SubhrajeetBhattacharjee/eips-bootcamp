import { IsString, IsNotEmpty, IsInt, Min, IsOptional, IsNumber } from 'class-validator';

export class AwardXpDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  referenceId?: string;

  @IsNumber()
  @Min(0.1)
  @IsOptional()
  multiplier?: number;
}

