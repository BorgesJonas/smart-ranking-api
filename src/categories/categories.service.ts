import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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

  // findAll() {
  //   return `This action returns all categories`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} category`;
  // }

  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} category`;
  // }
}
