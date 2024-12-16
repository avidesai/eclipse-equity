"use strict";
// /src/routes/authRoutes.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user")); // Make sure to export IUser interface from your user model
const router = express_1.default.Router();
exports.authRoutes = router;
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
// Register a new user with email verification
router.post('/signup', [
    (0, express_validator_1.body)('firstName').notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { firstName, lastName, email, password } = req.body;
    try {
        let user = yield user_1.default.findOne({ email });
        if (user) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const verificationToken = crypto_1.default.randomBytes(20).toString('hex');
        user = new user_1.default({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            isVerified: false,
            isPremium: false,
            verificationToken,
        });
        yield user.save();
        // Send email verification
        const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
        const msg = {
            to: email,
            from: process.env.EMAIL_USER,
            subject: 'Verify your email - ValueVerse',
            text: `Verify your email by clicking the link: ${verificationLink}`,
            html: `<p>Verify your email by clicking the link below:</p>
          <a href="${verificationLink}">Verify Email</a>`,
        };
        yield mail_1.default.send(msg);
        res.status(201).json({ message: 'User registered successfully. Verification email sent.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
// Verify Email Endpoint
router.get('/verify-email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.query;
    if (!token) {
        res.status(400).json({ message: 'Token is required.' });
        return;
    }
    try {
        const user = yield user_1.default.findOne({ verificationToken: token });
        if (!user) {
            res.status(400).json({ message: 'Invalid or expired token.' });
            return;
        }
        user.set('isVerified', true);
        user.set('verificationToken', undefined);
        yield user.save();
        res.json({ message: 'Email verified successfully.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
