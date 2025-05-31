import { ObjectId } from "mongoose";

export interface IUserStats extends Document {
  userId: ObjectId;
  gamesPlayed: number;
  wins: number;
  losses: number;
  highScores: Record<string, number>;
  achievements: string[];
}
