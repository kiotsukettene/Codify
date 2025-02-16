import { Student  } from "../models/student.model.js";
import bcrypt from 'bcryptjs';
import { generateStudentTokenAndSetCookie } from "../utils/generateStudentTokenAndSetCookie.js";
import crypto from 'crypto';
import { sendPasswordResetEmail, sendResetSuccessEmail } from "../mailtrap/emails.js";
export const loginStudent = async (req,res) => {
    const {email, password} = req.body;
    try {

        const student = await Student.findOne({ email})

        if(!student){
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, student.password)

        if(!isPasswordValid){
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
        }
        generateStudentTokenAndSetCookie(res, student._id)
        student.lastLogin = new Date();
        await student.save()

        res.status(200).json({
            success: true,
            message: "Logged in Successfully",
            student: {
                ...student._doc,
                password: undefined
            }
        })
        
    } catch (error) {
        console.log("Error in Login Function", error)
        res.status(400).json({
            success: false,
            message: "Error Logging in Student"
        })
        
    }
}


export const logoutStudent = (req, res) => {
    res.clearCookie("studentToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};



export const forgotPasswordStudent = async (req,res) => {
    const {email} = req.body;

    try {
        const student = await Student.findOne({email})

        if(!student){
            return res.status(400).json({
                success: false,
                message: "Invalid Email"
            })
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        student.resetPasswordToken = resetToken;
        student.resetPasswordExpiresAt = resetTokenExpiresAt;

        await student.save();

        //send email
        await sendPasswordResetEmail(student.email,`${process.env.CLIENT_URL}/student/reset-password/${resetToken}`);

        res.status(200).json({
            success: true,
            message: "Reset Link Sent to Email"
        })


    } catch (error) {
        console.log("Error in Forgot Password Function", error)
        res.status(400).json({
            success: false,
            message: "Error in Forgot Password Function"
        })
    }
}

export const resetPasswordStudent = async (req,res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        const student = await Student.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        })

        if(!student){
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token"
            })
        }

        //update password
        const hashedPassword = await bcrypt.hash(password, 12);
        student.password = hashedPassword;
        student.resetPasswordToken = undefined;
        student.resetPasswordExpiresAt = undefined;
        await student.save();

        await sendResetSuccessEmail(student.email);
        res.status(200).json({
            success: true,
            message: "Password Reset Successfully" 
        })
        
    } catch (error) {
        console.log("Error in Reset Password Function", error)
        res.status(400).json({
            success: false,
            message: "Error in Reset Password Function"
        })
        
    }
}

export const checkAuthStudent = async () => {
    try {
        const response = await axios.get(`${API_URL}/check-auth`, { withCredentials: true });
        set({
            student: response.data.student,
            isAuthenticated: true,
            isCheckingAuth: false
        });
    } catch (error) {
        set({
            error: "Unauthorized - Please log in",
            isCheckingAuth: false,
            isAuthenticated: false
        });
    }
};
// export const verifyEmailStudent = async (req,res) => {
//     const {code} = req.body;
//     try {
//         const student = await Student.findOne({verificationCode: code})
//         if(!student){
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid Code"
//             })
//         }
//         student.isVerified = true;
//         await student.save();
//         generateStudentTokenAndSetCookie(res, student._id)
//         res.status(200).json({
//             success: true,
//             message: "Email Verified Successfully",
//             student: {
//                 ...student._doc,
//                 password: undefined
//             }
//         })
//     } catch (error) {
//         console.log("Error in Verify Email Function", error)
//         res.status(400).json({
//             success: false,
//             message: "Error in Verify Email Function"
//         })
//     }
// }