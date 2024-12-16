// /src/routes/authRoutes.ts

import express, { Request, Response } from 'express';
import sgMail from '@sendgrid/mail';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';
import User, { IUser } from '../models/user';
import { Document } from 'mongoose';

// Type for request body
interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface VerifyEmailRequest extends Request {
  query: {
    token?: string;
  };
}

const router = express.Router();
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// Function to get and validate client URL
const getClientUrl = (): string => {
  const clientUrl = process.env.CLIENT_URL || process.env.PRODUCTION_URL;
  if (!clientUrl) {
    throw new Error('CLIENT_URL or PRODUCTION_URL environment variable is not set');
  }
  return clientUrl;
};

// Register a new user with email verification
router.post(
  '/signup',
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req: Request<{}, {}, SignupRequest>, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = crypto.randomBytes(20).toString('hex');
      
      user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isVerified: false,
        isPremium: false,
        verificationToken,
      });
      
      await user.save();

      // Send email verification
      try {
        const clientUrl = getClientUrl();
        const verificationLink = `${clientUrl}/verify-email?token=${verificationToken}`;
        
        const msg = {
          to: email,
          from: process.env.EMAIL_USER!,
          subject: 'Verify your email - ValueVerse',
          text: `Verify your email by clicking the link: ${verificationLink}`,
          html: `<p>Verify your email by clicking the link below:</p>
                 <a href="${verificationLink}">Verify Email</a>`,
        };
        
        await sgMail.send(msg);
        res.status(201).json({ 
          message: 'User registered successfully. Verification email sent.',
          verificationLink // Optional: remove in production if you don't want to expose the link
        });
      } catch (error) {
        // If email sending fails, delete the user and return an error
        await User.deleteOne({ _id: user._id });
        res.status(500).json({ 
          message: 'Failed to send verification email. Please try again.',
          error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return;
      }
    } catch (error) {
      res.status(500).json({ 
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Verify Email Endpoint
router.get(
  '/verify-email',
  async (req: VerifyEmailRequest, res: Response): Promise<void> => {
    const { token } = req.query;
    
    if (!token) {
      res.status(400).json({ message: 'Token is required.' });
      return;
    }

    try {
      const user = await User.findOne({ verificationToken: token });
      
      if (!user) {
        res.status(400).json({ message: 'Invalid or expired token.' });
        return;
      }

      user.set('isVerified', true);
      user.set('verificationToken', undefined);
      await user.save();

      res.json({ 
        message: 'Email verified successfully.',
        userId: user._id // Optional: if you need the userId for frontend redirects
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

export { router as authRoutes };