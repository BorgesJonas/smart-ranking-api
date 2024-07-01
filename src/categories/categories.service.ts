import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './interface/category.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categorieModule: Model<Category>,
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

  async findAll(category?: string): Promise<Category[]> {
    if (category) {
      this.logger.log(`Getting category ${category}`);
      const categoryOnDb = await this.categorieModule.find({ category }).exec();

      if (!categoryOnDb.length) {
        throw new NotFoundException(`Category ${category} not found`);
      }

      return categoryOnDb;
    }

    this.logger.log('Getting categories');
    return await this.categorieModule.find().exec();
  }

  async findOne(id: string): Promise<Category> {
    this.logger.log(`Getting players with the id ${id}`);
    const category = await this.categorieModule.findById(id).exec();

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
}
