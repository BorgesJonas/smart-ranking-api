import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Challenge, Match } from './interfaces/challenge.entity';
import { PlayersService } from 'src/players/players.service';
import { CategoriesService } from 'src/categories/categories.service';
import { ChallengeStatus } from './interfaces/challenge-status.enum';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private readonly logger = new Logger(ChallengesService.name);

  async create(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    this.logger.log('Creating challenge');

    const players = await this.playersService.findAll();

    createChallengeDto.players.map((playerDto) => {
      const filteredPlayer = players.find(
        (player) => player._id.toString() === playerDto._id,
      );

      if (!filteredPlayer) {
        throw new BadRequestException(
          `The player with id ${playerDto._id} is not a valid player`,
        );
      }
    });

    /** Check if challenge requester is one of the match players */
    const isRequesterMatchPlayer = createChallengeDto.players.filter(
      (player) => player._id === createChallengeDto.requester,
    );

    if (!isRequesterMatchPlayer.length) {
      throw new BadRequestException(`The requester must be a match player!`);
    }

    /** Get the category according to the requester player's id */
    const playerCategory = await this.categoriesService.findPlayerCategory(
      createChallengeDto.requester,
    );

    if (!playerCategory) {
      throw new BadRequestException(
        'The requester needs to be registered in one category!',
      );
    }

    const createdChallenge = new this.challengeModel(createChallengeDto);
    createdChallenge.category = playerCategory.category;
    createdChallenge.dateRequest = new Date();
    createdChallenge.status = ChallengeStatus.PENDING;

    this.logger.log(`Created challenge: ${JSON.stringify(createdChallenge)}`);

    return await createdChallenge.save();
  }

  findAll(): Promise<Challenge[]> {
    return this.challengeModel
      .find()
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();
  }

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
