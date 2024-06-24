import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: Player[] = [];

  async getPlayers(email?: string): Promise<Player[] | Player> {
    if (email) {
      this.logger.log(`Getting players with the email ${email}`);
      const player = this.players.find((player) => player.email === email);

      if (!player) {
        throw new NotFoundException(`Player with the email ${email} not found`);
      }

      return player;
    }

    this.logger.log('Getting players');
    return this.players;
  }

  async createUpdatePlayer(playerDto: CreatePlayerDto): Promise<void> {
    this.logger.log(`Creating player: ${JSON.stringify(playerDto)}`);
    const { email } = playerDto;
    const player = await this.players.find((player) => player.email === email);

    if (player) {
      await this.update(player, playerDto);
    } else {
      await this.create(playerDto);
    }
  }

  async deletePlayer(id: string): Promise<void> {
    this.logger.log(`Deleting player with the ID: ${id}`);
    const player = this.players.find((player) => player.id === id);

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    this.players = this.players.filter((player) => player.id !== id);
  }

  private async create(playerDto: CreatePlayerDto): Promise<void> {
    const { name, email, phoneNumber } = playerDto;

    const player: Player = {
      id: uuidv4(),
      name,
      phoneNumber,
      email,
      ranking: 'A',
      positionRanking: 1,
      photoUrl: 'www.google.com.br/foto123.jpg',
    };

    this.players.push(player);
  }

  private async update(
    player: Player,
    playerDto: CreatePlayerDto,
  ): Promise<void> {
    const { name } = playerDto;
    player.name = name;
  }
}
