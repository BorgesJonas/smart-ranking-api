import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async findAll(@Query('email') email?: string): Promise<Player[]> {
    return await this.playersService.findAll(email);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Player> {
    return await this.playersService.findOne(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() playerDto: CreatePlayerDto): Promise<void> {
    return await this.playersService.create(playerDto);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() playerDto: UpdatePlayerDto,
  ): Promise<void> {
    return await this.playersService.update(id, playerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.playersService.remove(id);
  }
}
