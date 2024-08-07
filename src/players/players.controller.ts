import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { ParamsValidationPipe } from 'src/common/pipes/params-validation.pipe';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async findAll(@Query('email') email?: string): Promise<Player[]> {
    return await this.playersService.findAll(email);
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  async findOne(
    @Param('id', ParamsValidationPipe) id: string,
  ): Promise<Player> {
    return await this.playersService.findOne(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() playerDto: CreatePlayerDto): Promise<void> {
    return await this.playersService.create(playerDto);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', ParamsValidationPipe) id: string,
    @Body() playerDto: UpdatePlayerDto,
  ): Promise<void> {
    return await this.playersService.update(id, playerDto);
  }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  async remove(@Param('id', ParamsValidationPipe) id: string): Promise<void> {
    await this.playersService.remove(id);
  }
}
