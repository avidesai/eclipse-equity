// src/routes/authRoutes.ts
import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User, { IUser } from '../models/user';
import authMiddleware, { UserPayload } from '../middleware/auth';
import environment from '../config/environment';
import { RequestHandler } from 'express';

const router = express.Router();

interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface SigninRequest {
  email: string;
  password: string;
}

// Helper function to create user payload
const createUserPayload = (user: IUser): UserPayload => ({
  id: user._id.toString(),
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName
});

// Register a new user
router.post(
  '/signup',
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  async (req: Request<{}, {}, SignupRequest>, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      await user.save();

      const payload = createUserPayload(user);
      const token = jwt.sign(payload, environment.JWT_SECRET!, { expiresIn: '24h' });

      res.status(201).json({
        token,
        user: {
          ...payload,
          isPremium: user.isPremium
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login a user
router.post(
  '/signin',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request<{}, {}, SigninRequest>, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }

      const payload = createUserPayload(user);
      const token = jwt.sign(payload, environment.JWT_SECRET!, { expiresIn: '24h' });

      res.json({
        token,
        user: {
          ...payload,
          isPremium: user.isPremium
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get current user
const getCurrentUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const userData = createUserPayload(user);
    res.json({
      ...userData,
      isPremium: user.isPremium
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

router.get('/me', authMiddleware, getCurrentUser);

export { router as authRoutes };