import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const users = await User.find({});
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .post(async (req, res) => {
        try {
            const user = await User.create(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

router.route('/:id')
    .put(async (req, res) => {
        try {
            const user = await User.findById(req.params.id);

            if (user) {
                user.username = req.body.username || user.username;
                if (req.body.password) {
                    user.password = req.body.password;
                }
                user.role = req.body.role || user.role;
                user.fullName = req.body.fullName || user.fullName;
                user.status = req.body.status || user.status;

                const updatedUser = await user.save();
                res.json(updatedUser);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    })
    .delete(async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.json({ message: 'User removed' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

export default router;
