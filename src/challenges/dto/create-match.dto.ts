import { IsNotEmpty } from 'class-validator';
import { Result } from '../interfaces/challenge.entity';

export class CreateMatchDto {
  @IsNotEmpty()
  def: string;

  @IsNotEmpty()
  result: Result[];
}
