import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProblemAnswerDto {
  @IsString()
  @IsNotEmpty()
  problemId: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class SubmitCompetitionDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProblemAnswerDto)
  answers: ProblemAnswerDto[];
}
