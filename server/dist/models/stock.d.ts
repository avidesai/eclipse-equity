import mongoose, { Document } from 'mongoose';
interface IStock extends Document {
    symbol: string;
    name: string;
    logo: string;
    price: number;
    change?: number;
    changePercent?: number;
    marketCap?: number;
    enterpriseValue?: number;
    roic?: number;
    revenue?: {
        current: number;
        growth: number;
        cagr: number;
    };
    netIncome?: {
        current: number;
        growth: number;
        cagr: number;
    };
    fcf?: {
        current: number;
        growth: number;
        cagr: number;
    };
    grossMargin?: number;
    netMargin?: number;
    fcfMargin?: number;
    psRatio?: number;
    peRatio?: number;
    fcfYield?: number;
    cash?: number;
    debt?: number;
    netCash?: number;
    terminalValue?: number;
    intrinsicValue?: number;
    upside?: number;
    historicalMetrics?: Array<{
        year: number;
        revenue: number;
        netIncome: number;
        fcf: number;
        shares: number;
    }>;
    dcfModelUrl?: string;
}
declare const _default: mongoose.Model<IStock, {}, {}, {}, mongoose.Document<unknown, {}, IStock> & IStock & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
