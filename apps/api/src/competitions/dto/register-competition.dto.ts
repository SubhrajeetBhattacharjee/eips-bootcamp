import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterCompetitionDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
