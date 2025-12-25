import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && (await user.matchPassword(password)) && user.status === 'active') {
            res.json({
                id: user._id,
                username: user.username,
                role: user.role,
                fullName: user.fullName,
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials or inactive account' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
