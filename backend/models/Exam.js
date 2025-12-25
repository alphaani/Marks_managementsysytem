import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, default: 'open' },
}, { timestamps: true });

const Exam = mongoose.model('Exam', examSchema);
export default Exam;
