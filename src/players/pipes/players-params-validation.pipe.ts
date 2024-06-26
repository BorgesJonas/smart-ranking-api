import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class PlayersParamsValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): void {
    console.log('VALUE', value);
  }
}
