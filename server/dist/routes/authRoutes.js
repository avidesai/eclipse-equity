"use strict";
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
// src/routes/authRoutes.ts
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const auth_1 = __importDefault(require("../middleware/auth"));
const environment_1 = __importDefault(require("../config/environment"));
const router = express_1.default.Router();
exports.authRoutes = router;
// Helper function to create user payload
const createUserPayload = (user) => ({
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
});
// Register a new user
router.post('/signup', [
    (0, express_validator_1.body)('firstName').notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { firstName, lastName, email, password } = req.body;
    try {
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = new user_1.default({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        yield user.save();
        const payload = createUserPayload(user);
        const token = jsonwebtoken_1.default.sign(payload, environment_1.default.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({
            token,
            user: Object.assign(Object.assign({}, payload), { isPremium: user.isPremium })
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
// Login a user
router.post('/signin', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, password } = req.body;
    try {
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const payload = createUserPayload(user);
        const token = jsonwebtoken_1.default.sign(payload, environment_1.default.JWT_SECRET, { expiresIn: '24h' });
        res.json({
            token,
            user: Object.assign(Object.assign({}, payload), { isPremium: user.isPremium })
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
// Get current user
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const userData = createUserPayload(user);
        res.json(Object.assign(Object.assign({}, userData), { isPremium: user.isPremium }));
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/me', auth_1.default, getCurrentUser);
//# sourceMappingURL=authRoutes.js.map