import express from 'express';
import Student from '../models/Student.js';

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const students = await Student.find({})
                .populate('user')
                .populate('class');
            res.json(students);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .post(async (req, res) => {
        try {
            let student = await Student.create(req.body);
            student = await Student.findById(student._id)
                .populate('user')
                .populate('class');
            res.status(201).json(student);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

router.route('/:id')
    .put(async (req, res) => {
        try {
            const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .populate('user')
                .populate('class');
            res.json(student);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    })
    .delete(async (req, res) => {
        try {
            await Student.findByIdAndDelete(req.params.id);
            res.json({ message: 'Student removed' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

export default router;
