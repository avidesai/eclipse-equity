// /src/app.ts

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import stockRoutes from './routes/stockRoutes';
import paymentRoutes from './routes/paymentRoutes';
import { authRoutes } from './routes/authRoutes';
import passport from 'passport';
import './config/passport';

const app = express();

const allowedOrigins = [
  'https://valueverse.pro',
  'https://www.valueverse.pro',
  'https://valueverse-git-main-avidesais-projects.vercel.app',
  'http://localhost:3000'
];

// Configure CORS
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// For Stripe webhook
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// For all other routes
app.use(bodyParser.json());

app.use('/api/stocks', stockRoutes);
app.use('/api/payments', paymentRoutes);
app.use(passport.initialize());
app.use('/api/auth', authRoutes);

export default app;