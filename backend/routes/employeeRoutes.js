import express from 'express';
import Employee from '../models/Employee.js';

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const employees = await Employee.find({})
                .populate('user')
                .populate('assignedClasses.class')
                .populate('assignedClasses.subject');
            res.json(employees);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .post(async (req, res) => {
        try {
            let employee = await Employee.create(req.body);
            employee = await Employee.findById(employee._id)
                .populate('user')
                .populate('assignedClasses.class')
                .populate('assignedClasses.subject');
            res.status(201).json(employee);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

router.route('/:id')
    .put(async (req, res) => {
        try {
            const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true })
                .populate('user')
                .populate('assignedClasses.class')
                .populate('assignedClasses.subject');
            res.json(employee);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    })
    .delete(async (req, res) => {
        try {
            await Employee.findByIdAndDelete(req.params.id);
            res.json({ message: 'Employee removed' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

export default router;
