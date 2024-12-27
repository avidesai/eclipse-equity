// /src/config/passport.ts

import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import User, { IUser } from '../models/user';

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback',
    },
    async (
      _accessToken: string,    // Added underscore
      _refreshToken: string,   // Added underscore
      profile: Profile,
      done: VerifyCallback
    ): Promise<void> => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            googleId: profile.id,
            firstName: profile.name?.givenName || '',
            lastName: profile.name?.familyName || '',
            email: profile.emails?.[0]?.value || '',
            isVerified: true,
          });
          await user.save();
        }
        done(null, user);
      } catch (err) {
        console.error(err);
        done(err as Error, false);
      }
    }
  )
);

passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

export default passport;