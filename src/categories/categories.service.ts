import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './interface/category.interface';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AddPlayerDto } from './dto/add-player-dto';
import { PlayersService } from 'src/players/players.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categorieModule: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}

  private readonly logger = new Logger(CategoriesService.name);

  async create(createCategoryDto: CreateCategoryDto): Promise<void> {
    this.logger.log(`Creating category: ${JSON.stringify(createCategoryDto)}`);
    const { category } = createCategoryDto;
    const categoryOnDb = await this.categorieModule
      .findOne({ category })
      .exec();

    if (categoryOnDb) {
      this.logger.log(
        `category: ${JSON.stringify(categoryOnDb)} already registered`,
      );
      throw new BadRequestException(`Category ${category} already registered`);
    }

    await new this.categorieModule(createCategoryDto).save();
  }

  async findAll(): Promise<Category[]> {
    this.logger.log('Getting categories');
    return await this.categorieModule.find().populate('players').exec();
  }

  async findOne(id: string): Promise<Category> {
    this.logger.log(`Getting players with the id ${id}`);
    const category = await this.categorieModule
      .findById(id)
      .populate('players')
      .exec();

    if (!category) {
      throw new NotFoundException(`Category with the id ${id} not found`);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    this.logger.log(`Updating player with the id: ${id}`);

    const category = await this.categorieModule.findById(id).exec();

    if (!category) {
      throw new NotFoundException(`Category with the id ${id} not found`);
    }

    await this.categorieModule
      .findByIdAndUpdate(id, { $set: updateCategoryDto })
      .exec();
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting category with the ID: ${id}`);
    const player = await this.categorieModule.findById(id).exec();

    if (!player) {
      throw new NotFoundException(`Category with the id ${id} not found`);
    }

    await this.categorieModule.findByIdAndDelete(id).exec();
  }

  async addPlayer(addPlayerDto: AddPlayerDto): Promise<void> {
    const { idCategory, idPlayer } = addPlayerDto;

    this.logger.log(
      `Adding player with the id ${idPlayer} to the category with the id ${idCategory}`,
    );

    const category = await this.categorieModule.findById(idCategory).exec();

    if (!category) {
      throw new NotFoundException(
        `Category with the id ${idCategory} not found`,
      );
    }

    const player = await this.playersService.findOne(idPlayer);

    if (!player) {
      throw new NotFoundException(`Player with the id ${idPlayer} not found`);
    }

    const playerInCategory = category.players.some(
      (id) => id.toString() === idPlayer,
    );

    if (playerInCategory) {
      throw new NotFoundException(
        `Player with the name ${player.name} is already registered in this category`,
      );
    }

    const playerObjectId = new mongoose.Types.ObjectId(idPlayer);
    category.players.push(playerObjectId);

    await this.categorieModule
      .findByIdAndUpdate(idCategory, { $set: category })
      .exec();
  }

  async findPlayerCategory(id: string): Promise<Category> {
    const players = await this.playersService.findAll();

    const filteredPlayer = players.filter(
      (player) => player._id.toString() === id,
    );

    if (!filteredPlayer.length) {
      throw new BadRequestException(`User not with the id: ${id} not found`);
    }

    return await this.categorieModule
      .findOne({ players: { $in: [id] } })
      .exec();
  }
}
