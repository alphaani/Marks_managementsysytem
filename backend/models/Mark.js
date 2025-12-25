import mongoose from 'mongoose';

const markSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The teacher who entered the marks
    marks: { type: Number, required: true },
    entryDate: { type: Date, default: Date.now },
}, { timestamps: true });

const Mark = mongoose.model('Mark', markSchema);
export default Mark;
