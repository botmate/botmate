import { Schema, model } from 'mongoose';

export interface IUser {
  _id: string;
  username: string;
  password: string;
  role?: string;
  createdAt: Date;
}

export const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: false, default: 'user' },
});

export const UserModel = model<IUser>('users', userSchema);
