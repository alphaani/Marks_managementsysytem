import express from 'express';
import Class from '../models/Class.js';

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const classes = await Class.find({});
            res.json(classes);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .post(async (req, res) => {
        try {
            const newClass = await Class.create(req.body);
            res.status(201).json(newClass);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

router.route('/:id')
    .put(async (req, res) => {
        try {
            const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(updatedClass);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    })
    .delete(async (req, res) => {
        try {
            await Class.findByIdAndDelete(req.params.id);
            res.json({ message: 'Class removed' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

export default router;
