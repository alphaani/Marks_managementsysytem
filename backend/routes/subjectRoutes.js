import express from 'express';
import Subject from '../models/Subject.js';

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const subjects = await Subject.find({});
            res.json(subjects);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .post(async (req, res) => {
        try {
            const subject = await Subject.create(req.body);
            res.status(201).json(subject);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

router.route('/:id')
    .put(async (req, res) => {
        try {
            const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(subject);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    })
    .delete(async (req, res) => {
        try {
            await Subject.findByIdAndDelete(req.params.id);
            res.json({ message: 'Subject removed' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

export default router;
