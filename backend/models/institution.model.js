import mongoose from 'mongoose';

const institutionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    institution_name: {
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

// const subscriptionSchema = new mongoose.Schema({
//     institution: {
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'Institution',
//         required: true
//     },
//     plan: {
//         type: String,
//         default: "Premium"
//     },
//     paymentMethod: {
//         type: String,
//         default: "credit_card"
//     },
//     amount: {
//         type: Number,
//         default: 24.99
//     },
//     billingExpiration: {
//         type: Date, 
//         default: Date.now
//     },
//     isPaid: {
//         type: Boolean,
//         default: false
//     },
// })


export const Institution = mongoose.model('Institution', institutionSchema);
// export const Subscription = mongoose.model('Subscription', subscriptionSchema);
// export const Invoice = mongoose.model('Invoice', invoiceSchema);