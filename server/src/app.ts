// /src/app.ts

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import stockRoutes from './routes/stockRoutes';
import paymentRoutes from './routes/paymentRoutes';
import { authRoutes } from './routes/authRoutes';
import passport from 'passport';
import './config/passport';
import environment from './config/environment';
const app = express();

// Allowed origins for CORS
const allowedOrigins = environment.CLIENT_URLS;

// CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS to all routes except the webhook
app.use(cors(corsOptions));

// For Stripe webhook (Stripe doesn't send an Origin header)
app.use(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  (_req, _res, next) => {
    next();
  }
);

// General middleware
app.use(bodyParser.json());

// Routes
app.use('/api/stocks', stockRoutes);
app.use('/api/payments', paymentRoutes);
app.use(passport.initialize());
app.use('/api/auth', authRoutes);

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Global Error Handler:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;
