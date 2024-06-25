import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://jowb:Risoto%40182@cluster0.hh8e9an.mongodb.net/smart_ranking?retryWrites=true&w=majority&appName=Cluster0',
    ),
    PlayersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
