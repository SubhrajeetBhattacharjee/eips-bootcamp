import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GenerateReferralDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsOptional()
  username?: string;
}
