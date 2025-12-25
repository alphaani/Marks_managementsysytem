import mongoose from 'mongoose';

const correctionRequestSchema = new mongoose.Schema({
    mark: { type: mongoose.Schema.Types.ObjectId, ref: 'Mark', required: false },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The targeted teacher
    originalMarks: { type: Number, required: false },
    proposedMarks: { type: Number, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'teacher_approved', 'approved', 'rejected'] },
    requestDate: { type: Date, default: Date.now },
    reason: { type: String, required: true },
    teacherReviewDate: { type: Date },
    adminReviewDate: { type: Date },
    teacherComment: { type: String },
    adminComment: { type: String },
}, { timestamps: true });

const CorrectionRequest = mongoose.model('CorrectionRequest', correctionRequestSchema);
export default CorrectionRequest;
