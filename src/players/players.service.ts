import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: Player[] = [];

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async getPlayers(email?: string): Promise<Player[]> {
    if (email) {
      this.logger.log(`Getting players with the email ${email}`);
      const player = await this.playerModel.find({ email }).exec();

      if (!player) {
        throw new NotFoundException(`Player with the email ${email} not found`);
      }

      return player;
    }

    this.logger.log('Getting players');
    return this.playerModel.find().exec();
  }

  async getPlayerById(id: string): Promise<Player> {
    this.logger.log(`Getting players with the id ${id}`);
    const player = await this.playerModel.findById(id).exec();

    if (!player) {
      throw new NotFoundException(`Player with the id ${id} not found`);
    }

    return player;
  }

  async createPlayer(playerDto: CreatePlayerDto): Promise<void> {
    this.logger.log(`Creating player: ${JSON.stringify(playerDto)}`);

    const { email } = playerDto;
    const player = await this.playerModel.findOne({ email }).exec();

    if (player) {
      throw new BadRequestException(
        `Player with the email ${email} is already registered`,
      );
    }

    await new this.playerModel(playerDto).save();
  }

  async updatePlayer(id: string, playerDto: UpdatePlayerDto): Promise<void> {
    this.logger.log(`Updating player with the id: ${id}`);

    const player = await this.playerModel.findById(id).exec();

    if (!player) {
      throw new NotFoundException(`Player with the id ${id} not found`);
    }

    await this.playerModel.findByIdAndUpdate(id, { $set: playerDto }).exec();
  }

  async deletePlayer(id: string): Promise<void> {
    this.logger.log(`Deleting player with the ID: ${id}`);
    const player = await this.playerModel.findById(id).exec();

    if (!player) {
      throw new NotFoundException(`Player with the id ${id} not found`);
    }

    await this.playerModel.findByIdAndDelete(id).exec();
  }
}
