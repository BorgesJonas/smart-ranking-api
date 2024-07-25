import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ChallengeStatus } from '../interfaces/challenge-status.enum';
import { UpdateChallengeDto } from '../dto/update-challenge.dto';

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly allowedStatus = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELED,
  ];

  transform(value: UpdateChallengeDto): unknown {
    const status = value.status.toUpperCase();

    if (!this.isStatusValid(status)) {
      throw new BadRequestException(`${status} is not a valid status`);
    }

    return value;
  }

  private isStatusValid(status: any): boolean {
    const idx = this.allowedStatus.indexOf(status);
    return idx !== -1;
  }
}
