import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from './interfaces/challenge.entity';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    return this.challengesService.create(createChallengeDto);
  }

  @Get()
  findAll(): Promise<Challenge[]> {
    return this.challengesService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.challengesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateChallengeDto: UpdateChallengeDto,
  // ) {
  //   return this.challengesService.update(+id, updateChallengeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.challengesService.remove(+id);
  // }
}
