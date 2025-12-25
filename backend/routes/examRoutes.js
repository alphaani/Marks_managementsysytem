import express from 'express';
import Exam from '../models/Exam.js';

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const exams = await Exam.find({});
            res.json(exams);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .post(async (req, res) => {
        try {
            const exam = await Exam.create(req.body);
            res.status(201).json(exam);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

router.route('/:id')
    .put(async (req, res) => {
        try {
            const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(exam);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    })
    .delete(async (req, res) => {
        try {
            await Exam.findByIdAndDelete(req.params.id);
            res.json({ message: 'Exam removed' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

export default router;
