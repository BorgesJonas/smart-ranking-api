import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: Player[] = [];

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async getPlayers(email?: string): Promise<Player[] | Player> {
    if (email) {
      this.logger.log(`Getting players with the email ${email}`);
      const player = await this.playerModel.findOne({ email }).exec();

      if (!player) {
        throw new NotFoundException(`Player with the email ${email} not found`);
      }

      return player;
    }

    this.logger.log('Getting players');
    return this.playerModel.find().exec();
  }

  async createUpdatePlayer(playerDto: CreatePlayerDto): Promise<void> {
    this.logger.log(`Creating player: ${JSON.stringify(playerDto)}`);
    const { email } = playerDto;

    const player = await this.playerModel.findOne({ email }).exec();

    if (player) {
      await this.update(playerDto);
    } else {
      await this.create(playerDto);
    }
  }

  async deletePlayer(id: string): Promise<DeleteResult> {
    this.logger.log(`Deleting player with the ID: ${id}`);
    const player = await this.playerModel.findOne({ id }).exec();

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    return await this.playerModel.deleteOne({ id }).exec();
  }

  private async create(playerDto: CreatePlayerDto): Promise<Player> {
    const player = new this.playerModel(playerDto);
    return await player.save();
  }

  private async update(playerDto: CreatePlayerDto): Promise<Player> {
    return await this.playerModel
      .findOneAndUpdate({ email: playerDto.email }, { $set: playerDto })
      .exec();
  }
}
