import { IsNotEmpty, IsString } from 'class-validator';

export class AddPlayerDto {
  @IsString()
  @IsNotEmpty()
  idPlayer: string;

  @IsString()
  @IsNotEmpty()
  idCategory: string;
}
