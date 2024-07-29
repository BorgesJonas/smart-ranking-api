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
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';
import { CreateMatchDto } from './dto/create-match.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Challenge> {
    return this.challengesService.findOne(id);
  }

  @Get('/player/:id')
  findAllByPlayer(@Param('id') id: string): Promise<Challenge[]> {
    return this.challengesService.findAllByPlayer(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ChallengeStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
  ): Promise<Challenge> {
    return this.challengesService.update(id, updateChallengeDto);
  }

  @Post('/:id/match')
  createMatch(
    @Param('id') id: string,
    @Body(ValidationPipe) createMatchDto: CreateMatchDto,
  ): Promise<void> {
    return this.challengesService.createMatch(id, createMatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.challengesService.remove(id);
  }
}
