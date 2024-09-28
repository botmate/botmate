import { Schema, model } from 'mongoose';

export interface ISession {
  _id: string;
  token: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}

export const sessionSchema = new Schema<ISession>({
  userId: { type: String, ref: 'users', required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  expiresAt: { type: Date, required: true },
});

export const SessionModel = model<ISession>('sessions', sessionSchema);
