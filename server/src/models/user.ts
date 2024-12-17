// /src/models/user.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  googleId?: string;
  isPremium: boolean;
}

const userSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String },
  isPremium: { type: Boolean, default: false },
});

export default mongoose.model<IUser>('User', userSchema);
