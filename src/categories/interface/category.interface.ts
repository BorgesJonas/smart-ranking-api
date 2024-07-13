import { Document, Types } from 'mongoose';

export interface Category extends Document {
  readonly category: string;
  description: string;
  events: Array<Event>;
  players: Array<Types.ObjectId>;
}

export interface Event {
  name: string;
  operation: string;
  value: number;
}
