import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './schemas/category.schema';
import { PlayersModule } from 'src/players/players.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    PlayersModule,
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
  ],
})
export class CategoriesModule {}
