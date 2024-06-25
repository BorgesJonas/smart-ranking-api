import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { PlayerSchema } from './schemas/player.schema';

@Module({
  controllers: [PlayersController],
  providers: [PlayersService],
  imports: [
    MongooseModule.forFeature([{ name: 'Player', schema: PlayerSchema }]),
  ],
})
export class PlayersModule {}
