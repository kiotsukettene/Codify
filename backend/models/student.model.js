import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    course: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
        required: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
}, { timestamps: true });

export const Student = mongoose.model('Student', studentSchema);