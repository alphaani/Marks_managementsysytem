import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import examRoutes from './routes/examRoutes.js';
import markRoutes from './routes/markRoutes.js';
import classRoutes from './routes/classRoutes.js';
import correctionRoutes from './routes/correctionRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/marks', markRoutes);
app.use('/api/correction-requests', correctionRoutes);
app.use('/api/classes', classRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
