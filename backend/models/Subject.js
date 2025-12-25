import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    status: { type: String, default: 'active' },
}, { timestamps: true });

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;
