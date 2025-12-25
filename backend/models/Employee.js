import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional, as not all employees might have a user account immediately
    fullName: { type: String, required: true },
    employeeType: { type: String, required: true },
    salary: { type: Number },
    dateOfJoining: { type: Date },
    assignedClasses: [{
        class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
        subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }
    }]
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
