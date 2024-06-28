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
  async getPlayers(@Query('email') email?: string): Promise<Player[]> {
    return await this.playersService.getPlayers(email);
  }

  @Get(':id')
  async getPlayerById(@Param('id') id: string): Promise<Player> {
    return await this.playersService.getPlayerById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createUpdatePlayer(@Body() playerDto: CreatePlayerDto): Promise<void> {
    return await this.playersService.createPlayer(playerDto);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Param('id') id: string,
    @Body() playerDto: UpdatePlayerDto,
  ): Promise<void> {
    return await this.playersService.updatePlayer(id, playerDto);
  }

  @Delete(':id')
  async deletePlayer(@Param('id') id: string): Promise<void> {
    await this.playersService.deletePlayer(id);
  }
}
