const authService = require('../services/authService');
const asyncHandler = require('../middleware/asyncHandler');

const authController = {
    register: asyncHandler(async (req, res) => {
        const { username, email, password } = req.body;
        const user = await authService.register(username, email, password);

        res.status(201).json({
            success: true,
            data: user.toPublic()
        });
    }),

    login: asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const { user, token } = await authService.login(email, password);

        // Set token as HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production', // HTTPS in production
            maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
        });

        res.json({
            success: true,
            data: user.toPublic()
        });
    }),

    update: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const updates = req.body;
        const updatedUser = await authService.update(userId, updates);

        res.json({
            success: true,
            data: updatedUser.toPublic()
        });
    }),

    account: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const user = await authService.getById(userId);

        res.json({
            success: true,
            data: user.toPublic()
        });
    }),

    delete: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        await authService.delete(userId);

        res.json({
            success: true,
            data: null
        });
    }),

    logout: asyncHandler(async (req, res) => {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production'
        });

        res.json({
            success: true,
            data: null
        });
    }),

};

module.exports = authController;