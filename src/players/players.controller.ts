import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async getPlayers(@Query('email') email: string): Promise<Player[] | Player> {
    return await this.playersService.getPlayers(email);
  }

  @Post()
  async createUpdatePlayer(@Body() playerDto: CreatePlayerDto): Promise<void> {
    await this.playersService.createUpdatePlayer(playerDto);
  }

  @Delete(':id')
  async deletePlayer(@Param('id') id: string): Promise<void> {
    return await this.playersService.deletePlayer(id);
  }
}
