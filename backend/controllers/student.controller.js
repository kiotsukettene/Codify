import { Student } from '../models/student.model.js';
import { Institution } from '../models/institution.model.js';
import bcrypt from 'bcryptjs';
import { sendStudentWelcomeEmail } from '../mailtrap/emails.js';

export const registerStudent = async (req, res) => { 
    const { studentId, firstName, lastName, email, course, year, section, institutionId } = req.body;

    try {
        if (!studentId || !firstName || !lastName || !email || !course || !year || !section || !institutionId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const institution = await Institution.findById(institutionId);
        if (!institution) {
            return res.status(404).json({ message: 'Institution not found' });
        }

        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student already exists' });
        }

        // Set lastName as the default password
        const plainPassword = lastName.trim();
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const newStudent = await Student.create({
            studentId,
            firstName,
            lastName,
            email,
            course,
            year,
            section,
            password: hashedPassword,
            institution: institution._id,
        });

        const savedStudent = await Student.findById(newStudent._id).populate("institution", "institutionName");

        // Send login details to student's email
        await sendStudentWelcomeEmail(
            savedStudent.email,
            savedStudent.firstName,
            savedStudent.lastName,
            plainPassword,  // Send lastName as their temporary password
            savedStudent.institution.institutionName
        );

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            student: {
                ...savedStudent._doc,
                password: undefined,
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getStudents = async (req, res) => {
    try {
        const students = await Student.find().populate("institution", "institutionName");
        res.status(200).json({
            success: true,
            students
        })
    }
    catch(error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate("institution", "institutionName");
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({
            success: true,
            student
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateStudent = async (req, res) => {
    try {
        const { studentId, firstName, lastName, email, course, year, section, password } = req.body;
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, { studentId, firstName, lastName, email, course, year, section, password }, { new: true });

        if(!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
        })
    } catch (error) {   
        res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteStudent = async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);

        if (!deletedStudent) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.status(200).json({ success: true, message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};