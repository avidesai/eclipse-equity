import { RequestHandler } from 'express';
export interface UserPayload {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}
declare const authMiddleware: RequestHandler;
export default authMiddleware;
