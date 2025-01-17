// src/models/user.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  googleId?: string;
  isPremium: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const userSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String },
  isPremium: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

export default mongoose.model<IUser>('User', userSchema);