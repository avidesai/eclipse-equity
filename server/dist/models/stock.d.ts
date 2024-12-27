import mongoose, { Document } from 'mongoose';
interface IStock extends Document {
    symbol: string;
    name: string;
    price: number;
    dcfModelUrl?: string;
}
declare const _default: mongoose.Model<IStock, {}, {}, {}, mongoose.Document<unknown, {}, IStock> & IStock & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
