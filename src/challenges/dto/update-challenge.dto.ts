import { PartialType } from '@nestjs/mapped-types';
import { CreateChallengeDto } from './create-challenge.dto';
import { ChallengeStatus } from '../interfaces/challenge-status.enum';
import { IsOptional } from 'class-validator';

export class UpdateChallengeDto extends PartialType(CreateChallengeDto) {
  @IsOptional()
  //@IsDate()
  challengeDate: Date;

  @IsOptional()
  status: ChallengeStatus;
}
