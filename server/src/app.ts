// app.ts

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import stockRoutes from './routes/stockRoutes';
import paymentRoutes from './routes/paymentRoutes';
import authRoutes from './routes/authRoutes';
import passport from 'passport';
import './config/passport';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/stocks', stockRoutes);
app.use('/api/payments', paymentRoutes);
app.use(passport.initialize());
app.use('/api/auth', authRoutes);

export default app;
