import { Institution } from "../models/institution.model.js";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import admin from "../utils/firebaseAdmin.js"
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendResetSuccessEmail
} from "../mailtrap/emails.js";




export const registerInstitution = async (req, res) => {
    // Prepare the data
    const {
        email,
        institutionName, 
        name,
        password,
        address,
        phoneNumber,
        subscription, 
        plan,
        paymentMethod,
        amount
    } = req.body;

    try {
        // Validate the data
        if (!email || !institutionName || !name || !password || !subscription || !plan || !paymentMethod || !amount || !address || !phoneNumber) {
            throw new Error("All fields are required");
        }

        const institutionAlreadyExists = await Institution.findOne({ institutionName });

        if (institutionAlreadyExists) {
            return res.status(400).json({
                success: false,
                message: "Institution already exists"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a verification token
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

       

        // Step 2: Create and save the Institution with the subscription reference
        const newInstitution = new Institution({
            email,
            institutionName, 
            name,
            password: hashedPassword,
            address,
            phoneNumber,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + (60 * 1000), // 1 minute
            subscription,
            plan,
            paymentMethod,
            amount,
        });

        const savedInstitution = await newInstitution.save();
        await savedInstitution.save();

        // Step 4: Generate a token and set cookie
        generateTokenAndSetCookie(res, savedInstitution._id);

        // Step 5: Send verification email
        await sendVerificationEmail(savedInstitution.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "Institution registered successfully",
            institution: {
                ...savedInstitution._doc,
                password: undefined,
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

export const verifyEmail = async (req, res) => {

    const { code } = req.body; 

    try { 
        console.log("Finding institution with code: ", code);
        const institution = await Institution.findOne( {
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if (!institution) {
            console.log("Invalid or expired verification code");
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code. Please request a new one."
            })
        }

        console.log("Institution found: ", institution);
        institution.isVerified = true;
        institution.verificationToken = undefined;
        institution.verificationTokenExpiresAt = undefined;
        await institution.save();

        

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            institution: {
                ...institution._doc,
                password: undefined
            },
        });
    }
    catch(error) {
        console.log("Error verifying email", error);
        res.status(500).json({
            success: false,
            message: "Error verifying email"
        })
    }
}

export const resendVerificationCode = async (req, res) => {
    const { email } = req.body;

    try {
        const institution = await Institution.findOne({ email });

        if (!institution) {
            return res.status(400).json({
                success: false,
                messsage: "Institution not found"
            })
        }

        // Generate new verification code

        const newVerificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        institution.verificationToken = newVerificationToken;
        institution.verificationTokenExpiresAt = Date.now() + (60 * 1000); // 1 minute

        await institution.save();

        // Send new verification email

        await sendVerificationEmail(institution.email, newVerificationToken)

        res.status(200).json({
            success: true,
            message: "New verification code sent"
        })
    } catch (error) {
        console.log("Error resending verification code: ", error)
        res.status(500).json({
            success: false,
            message: "Error resending verification code",
            debugToken: newVerificationToken // ✅ Temporary Debugging
        })
    }
}


export const loginInstitution = async (req, res) => {

    const { email, password } = req.body;
    try {
        
        const institution = await Institution.findOne({ email });

        if (!institution) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, institution.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        generateTokenAndSetCookie(res, institution._id);

        institution.lastLogin = new Date();

        await institution.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            institution: {
                ...institution._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log("Error logging in institution", error);
        res.status(400).json({
            success: false,
            message: "Error logging in institution"
        })
    }
}

export const forgotPassword = async ( req, res) => {
    const { email } = req.body

    try {
        
        const institution = await Institution.findOne({ email });

        if (!institution) {
            return res.status(400).json({
                success: false,
                message: "Please provide an valid email"
            })
        }

        // Generate reset token

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        institution.resetPasswordToken = resetToken;
        institution.resetPasswordExpiresAt = resetTokenExpiresAt;

        await institution.save();

        // send reset password email

        await sendPasswordResetEmail(institution.email,  `${process.env.CLIENT_URL}/admin/reset-password/${resetToken}`);

        res.status(200).json({
            success: true,
            message: "Password reset email sent successfully"
        })

    } catch (error) {
        console.log("Error sending password reset email", error);
        res.status(400).json({
            success: false,
            message: "Error sending password reset email"
        })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const institution = await Institution.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        })

        if (!institution) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token"
            })
        }   

        // update password

        const hashedPassword = await bcrypt.hash(password, 10);
        institution.password= hashedPassword;
        institution.resetPasswordToken = undefined;
        institution.resetPasswordExpiresAt = undefined;

        await institution.save();

        // send reset success email

        await sendResetSuccessEmail(institution.email);

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        })


    } catch (error) {
        console.log("Error resetting password", error);
        res.status(400).json({
            success: false,
            message: "Error resetting password"
        })
    }
}

export const checkAuth = async (req, res) => {  
    const institution = await Institution.findById(req.institutionId).select("-password");

    if(!institution) {
        return res.status(400).json({
            success: false,
            message: "Institution not found"
        })
    }

    res.status(200).json({
        success: true,
        institution
    })
}

export const markAsPaid = async (req, res) => {
    try {
        const { institutionId } = req.body;

        const institution = await Institution.findById(institutionId);

        if (!institution) {
            return res.status(404).json({ success: false, message: "Institution not found" });
        }

        // Extend billingExpiration to one year from NOW
        const newExpiration = new Date();
        newExpiration.setFullYear(newExpiration.getFullYear() + 1);

        institution.isPaid = true;
        institution.billingExpiration = newExpiration;

        await sendWelcomeEmail(institution.email, institution.name);
        console.log("Welcome Email Sent")  
        await institution.save();

        res.status(200).json({
            success: true,
            message: "Payment successful! Subscription activated.",
            institution
        });

    } catch (error) {
        console.error("Error updating payment status:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const logoutInstitution = async (req, res) => {
    res.clearCookie("token")
    res.status(200).json({
        sucess: true,
        message: "Logged out successfully"
    })
}


export const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        // Verify Firebase ID Token
        const decodedToken = await admin.auth().verifyIdToken(token);
        const email = decodedToken.email;

        let institution = await Institution.findOne({ email });

        if (!institution) {
            return res.status(400).json({ success: false, message: "No registered institution found with this email" });
        }

        generateTokenAndSetCookie(res, institution._id);

        res.status(200).json({ success: true, institution });
    } catch (error) {
        console.error("Error verifying Firebase token", error);
        res.status(401).json({ success: false, message: "Invalid Google token" });
    }
};
