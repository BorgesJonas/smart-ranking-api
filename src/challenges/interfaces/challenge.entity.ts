import { Document } from 'mongoose';

import { ChallengeStatus } from './challenge-status.enum';
import { Player } from 'src/players/interfaces/player.interface';

export interface Challenge extends Document {
  challengeDate: Date;
  status: ChallengeStatus;
  dateRequest: Date;
  dateResponse: Date;
  requester: Player;
  category: string;
  players: Player[];
  match: Match;
}

export interface Match extends Document {
  category: string;
  players: Player[];
  requester: Player;
  resultado: Result[];
}

export interface Result {
  set: string;
}
