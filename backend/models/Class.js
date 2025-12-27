import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "10A", "Grade 5"
    status: { type: String, default: 'active' },
}, { timestamps: true });

const Class = mongoose.model('Class', classSchema);
export default Class;
// mongodb+srv://mohaalpha74_db_user:GCdeJHFedsjPvi07@cluster0.jqpozyk.mongodb.net/?appName=Cluster0
// GCdeJHFedsjPvi07
// mohaalpha74_db_user