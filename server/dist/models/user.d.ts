import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    googleId?: string;
    isPremium: boolean;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
