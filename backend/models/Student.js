import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    academicYear: { type: String },
    dateOfBirth: { type: Date },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;
