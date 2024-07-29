import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge, Match } from './interfaces/challenge.entity';
import { PlayersService } from 'src/players/players.service';
import { CategoriesService } from 'src/categories/categories.service';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { CreateMatchDto } from './dto/create-match.dto';

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

  findOne(id: string): Promise<Challenge> {
    return this.challengeModel
      .findById(id)
      .populate('requester')
      .populate('players')
      .populate('match');
  }

  findAllByPlayer(playerId: string): Promise<Challenge[]> {
    const player = this.playersService.findOne(playerId);

    if (!player) {
      throw new BadRequestException(`Player with the id ${playerId} not found`);
    }

    return this.challengeModel
      .find({ players: { $in: [playerId] } })
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();
  }

  async update(
    id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<Challenge> {
    const challenge = await this.challengeModel.findById(id);

    if (!challenge) {
      throw new BadRequestException(`Challenge with the id ${id} not found`);
    }

    if (updateChallengeDto.status) {
      challenge.dateResponse = new Date();
    }

    challenge.status = updateChallengeDto.status;
    challenge.challengeDate = updateChallengeDto.challengeDate;

    await this.challengeModel.findByIdAndUpdate(id, { $set: challenge }).exec();

    return challenge;
  }

  async createMatch(id: string, createMatchDto: CreateMatchDto): Promise<void> {
    const challenge = await this.challengeModel.findById(id);

    if (!challenge) {
      throw new BadRequestException(`Challenge with the id ${id} not found`);
    }

    const player = challenge.players.find(
      (player) => player._id.toString() === createMatchDto.def,
    );

    if (!player) {
      throw new BadRequestException(
        `The winner player doesn't belong to the match!`,
      );
    }

    const match = new this.matchModel(createMatchDto);

    match.category = challenge.category;
    match.players = challenge.players;
    const createdMatchResult = await match.save();

    challenge.status = ChallengeStatus.ACCOMPLISHED;
    challenge.match = createdMatchResult._id.toString();

    try {
      this.logger.log('Challenge', JSON.stringify(challenge));
      await this.challengeModel
        .findByIdAndUpdate(id, { $set: challenge })
        .exec();
    } catch (error) {
      this.logger.log('Error', error.message);
      await this.matchModel.deleteOne({ _id: createdMatchResult._id }).exec();
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string): Promise<void> {
    const challenge = await this.challengeModel.findById(id).exec();

    if (!challenge) {
      throw new BadRequestException(`Challenge with the id: ${id} not found!`);
    }

    challenge.status = ChallengeStatus.CANCELED;

    await this.challengeModel.findByIdAndUpdate(id, { $set: challenge }).exec();
  }
}
