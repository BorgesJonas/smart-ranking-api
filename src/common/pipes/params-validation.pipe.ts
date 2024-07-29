import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ParamsValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): void {
    console.log('VALUE', value);
    if (!value) {
      throw new BadRequestException(
        `The value of the parameter ${metadata.data} must be informed`,
      );
    }

    return value;
  }
}
