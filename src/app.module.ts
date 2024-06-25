import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URL), PlayersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
