// /src/models/user.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  googleId?: string;
  isVerified: boolean;
  isPremium: boolean;
  verificationToken?: string;
}

const userSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  isVerified: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  verificationToken: { type: String },
});

export default mongoose.model<IUser>('User', userSchema);