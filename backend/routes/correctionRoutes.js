import express from 'express';
import CorrectionRequest from '../models/CorrectionRequest.js';

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const corrections = await CorrectionRequest.find({})
                .populate({
                    path: 'mark',
                    populate: { path: 'student subject exam' }
                })
                .populate('student subject exam teacher');
            res.json(corrections);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .post(async (req, res) => {
        try {
            let correction = await CorrectionRequest.create(req.body);
            correction = await CorrectionRequest.findById(correction._id)
                .populate({
                    path: 'mark',
                    populate: { path: 'student subject exam' }
                })
                .populate('student subject exam teacher');
            res.status(201).json(correction);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

router.route('/:id')
    .put(async (req, res) => {
        try {
            const correction = await CorrectionRequest.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .populate({
                    path: 'mark',
                    populate: { path: 'student subject exam' }
                })
                .populate('student subject exam teacher');
            res.json(correction);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    })
    .delete(async (req, res) => {
        try {
            await CorrectionRequest.findByIdAndDelete(req.params.id);
            res.json({ message: 'Correction request removed' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

export default router;
