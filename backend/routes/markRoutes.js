import express from 'express';
import Mark from '../models/Mark.js';

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const marks = await Mark.find({})
                .populate('student')
                .populate('subject')
                .populate('exam')
                .populate('teacher');
            res.json(marks);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .post(async (req, res) => {
        try {
            let mark = await Mark.create(req.body);
            mark = await Mark.findById(mark._id)
                .populate('student')
                .populate('subject')
                .populate('exam')
                .populate('teacher');
            res.status(201).json(mark);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

router.route('/:id')
    .put(async (req, res) => {
        try {
            const mark = await Mark.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .populate('student')
                .populate('subject')
                .populate('exam')
                .populate('teacher');
            res.json(mark);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    })
    .delete(async (req, res) => {
        try {
            await Mark.findByIdAndDelete(req.params.id);
            res.json({ message: 'Mark removed' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

export default router;
