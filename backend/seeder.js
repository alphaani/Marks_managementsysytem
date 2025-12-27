import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Student from './models/Student.js';
import Employee from './models/Employee.js';
import Subject from './models/Subject.js';
import Exam from './models/Exam.js';
import Mark from './models/Mark.js';
import CorrectionRequest from './models/CorrectionRequest.js';
import Class from './models/Class.js';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '../.env' });

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Student.deleteMany();
        await Employee.deleteMany();
        await Subject.deleteMany();
        await Exam.deleteMany();
        await Mark.deleteMany();
        await CorrectionRequest.deleteMany();
        await Class.deleteMany();

        const salt = await bcrypt.genSalt(10);

        const users = await User.insertMany([
            { username: "admin", password: await bcrypt.hash("admin123", salt), role: "admin", fullName: "System Administrator", status: "active" },
            { username: "teacher1", password: await bcrypt.hash("teacher123", salt), role: "teacher", fullName: "John Smith", status: "active" },
            { username: "student1", password: await bcrypt.hash("student123", salt), role: "student", fullName: "Alice Johnson", status: "active" },
            { username: "teacher2", password: await bcrypt.hash("teacher123", salt), role: "teacher", fullName: "Sarah Wilson", status: "active" },
            { username: "student2", password: await bcrypt.hash("student123", salt), role: "student", fullName: "Bob Davis", status: "active" }
        ]);

        const classes = await Class.insertMany([
            { name: "10A", status: "active" },
            { name: "10B", status: "active" }
        ]);

        const subjects = await Subject.insertMany([
            { name: "Mathematics", code: "MATH101", status: "active" },
            { name: "English", code: "ENG101", status: "active" },
            { name: "Science", code: "SCI101", status: "active" },
            { name: "History", code: "HIST101", status: "active" }
        ]);



        const students = await Student.insertMany([
            { user: users[2]._id, fullName: "Alice Johnson", age: 20, gender: "Female", class: classes[0]._id, academicYear: "2024-2025", dateOfBirth: new Date("2004-05-15") },
            { user: users[4]._id, fullName: "Bob Davis", age: 19, gender: "Male", class: classes[0]._id, academicYear: "2024-2025", dateOfBirth: new Date("2005-03-22") }
        ]);

        const employees = await Employee.insertMany([
            { user: users[0]._id, fullName: "System Administrator", employeeType: "Admin", salary: 75000, dateOfJoining: new Date("2020-01-15") },
            {
                user: users[1]._id,
                fullName: "John Smith",
                employeeType: "Teacher",
                salary: 55000,
                dateOfJoining: new Date("2021-08-20"),
                assignedClasses: [
                    { class: classes[0]._id, subject: subjects[0]._id }, // 10A Math
                    { class: classes[0]._id, subject: subjects[2]._id }  // 10A Science
                ]
            },
            {
                user: users[3]._id,
                fullName: "Sarah Wilson",
                employeeType: "Teacher",
                salary: 52000,
                dateOfJoining: new Date("2022-01-10"),
                assignedClasses: [
                    { class: classes[0]._id, subject: subjects[1]._id } // 10A English
                ]
            }
        ]);

        const exams = await Exam.insertMany([
            { name: "Monthly Test 1", type: "Monthly", date: new Date("2024-01-15"), status: "open" },
            { name: "Midterm Exam", type: "Midterm", date: new Date("2024-02-15"), status: "open" },
            { name: "Final Exam", type: "Final", date: new Date("2024-05-15"), status: "closed" }
        ]);

        const marks = await Mark.insertMany([
            { student: students[0]._id, subject: subjects[0]._id, exam: exams[0]._id, marks: 85, teacher: users[1]._id, entryDate: new Date("2024-01-20") },
            { student: students[0]._id, subject: subjects[1]._id, exam: exams[0]._id, marks: 92, teacher: users[3]._id, entryDate: new Date("2024-01-20") },
            { student: students[1]._id, subject: subjects[0]._id, exam: exams[0]._id, marks: 78, teacher: users[1]._id, entryDate: new Date("2024-01-20") },
            { student: students[1]._id, subject: subjects[1]._id, exam: exams[0]._id, marks: 88, teacher: users[3]._id, entryDate: new Date("2024-01-20") }
        ]);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
