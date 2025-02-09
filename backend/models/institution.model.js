import mongoose from 'mongoose';

const institutionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    institutionName: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        default: "admin"
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    subscription: {
        type: String,
        default: "Monthly"
    },
    plan: {
        type: String,
        default: "Premium"
    },
    amount: {
        type: Number,
        default: 24.99
    },
    billingExpiration: {
        type: Date, 
        default: Date.now
    },
    paymentMethod: {
        type: String,
        default: "credit_card"
    },
    isPaid: {
        type: Boolean,
        default: false
    },

    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,

}, {timestamps: true});




export const Institution = mongoose.model('Institution', institutionSchema);
