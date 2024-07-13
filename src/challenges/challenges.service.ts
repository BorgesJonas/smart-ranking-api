import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge } from './interfaces/challenge.entity';
import { PlayersService } from 'src/players/players.service';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenged')
    private readonly challengeModel: Model<Challenge>,
    private readonly playersService: PlayersService,
  ) {}

  async create(createChallengeDto: CreateChallengeDto): Promise<void> {
    const players = await this.playersService.findAll();

    createChallengeDto.players.map((playerDto) => {
      const playerFilter = players.filter(
        (player) => player._id == playerDto._id,
      );

      if (!playerFilter.length) {
        throw new BadRequestException(
          `The id  ${playerDto._id} is not a valid player`,
        );
      }
    });
  }

  // findAll() {
  //   return `This action returns all challenges`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} challenge`;
  // }

  // update(id: number, updateChallengeDto: UpdateChallengeDto) {
  //   return `This action updates a #${id} challenge`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} challenge`;
  // }
}
