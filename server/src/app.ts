// app.ts

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import stockRoutes from './routes/stockRoutes';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/stocks', stockRoutes);

export default app;
