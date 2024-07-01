import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { ArrayMaxSize, IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @ArrayMaxSize(1)
  events: Event[];
}
