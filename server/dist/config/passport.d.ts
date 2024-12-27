import passport from 'passport';
import { IUser } from '../models/user';
declare global {
    namespace Express {
        interface User extends IUser {
        }
    }
}
export default passport;
