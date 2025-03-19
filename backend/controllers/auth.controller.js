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
import axios from 'axios';




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

        // Check for duplicate email
        const emailAlreadyExists = await Institution.findOne({ email });
        if (emailAlreadyExists) {
        return res.status(400).json({
            success: false,
            message: "An institution with this email already exists",
        });
        }

        // Check for duplicate institution name
        const institutionNameExists = await Institution.findOne({ institutionName });
        if (institutionNameExists) {
        return res.status(400).json({
            success: false,
            message: "An institution with this name already exists",
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



export const logoutInstitution = async (req, res) => {
    res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({
    success: true, // Fixed typo: "sucess" -> "success"
    message: "Logged out successfully",
  });
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

const PAYMONGO_API_URL = 'https://api.paymongo.com/v1/checkout_sessions';
const PAYMONGO_AUTH = Buffer.from(`${process.env.PAYMONGO_SECRET_KEY}:`).toString('base64');

export const initiatePayment = async (req, res) => {
  const { institutionId } = req.body;

  try {
    const institution = await Institution.findById(institutionId);
    if (!institution) {
      return res.status(404).json({ success: false, message: "Institution not found" });
    }

    const totalAmount = Math.max(institution.amount * 100, 10000); // Convert to cents

    const checkoutData = {
      data: {
        attributes: {
          line_items: [
            {
              currency: "PHP",
              amount: totalAmount,
              name: `Subscription for ${institution.institutionName}`,
              quantity: 1,
            },
          ],
          payment_method_types: ["card"],
          success_url: `${process.env.CLIENT_URL}/admin/payment-success`, // No token
          cancel_url: `${process.env.CLIENT_URL}/admin/payment-summary`,
          description: `Subscription payment for ${institution.institutionName}`,
        },
      },
    };

    const response = await axios.post(PAYMONGO_API_URL, checkoutData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${PAYMONGO_AUTH}`,
      },
    });

    institution.checkoutSessionId = response.data.data.id; // Still useful for reference
    await institution.save();

    console.log('Checkout URL:', response.data.data.attributes.checkout_url);
    res.status(200).json({
      success: true,
      checkoutUrl: response.data.data.attributes.checkout_url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Checkout session creation failed',
      error: error.message,
    });
  }
};

export const markAsPaid = async (req, res) => {
  const { institutionId } = req.body; // No successToken
  console.log('Mark as paid called with institutionId:', institutionId);

  try {
    const institution = await Institution.findById(institutionId);
    if (!institution) {
      console.log('Institution not found');
      return res.status(404).json({ success: false, message: "Institution not found" });
    }

    // No token validation anymore
    console.log('Marking institution as paid:', institutionId);

    institution.isPaid = true;
    institution.billingExpiration = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
    institution.checkoutSessionId = undefined; // Clear optional field
    await institution.save();

    console.log('Payment marked as successful for institution:', institutionId);

    try {
      await sendWelcomeEmail(institution.email, institution.name);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError.message);
    }

    res.status(200).json({
      success: true,
      message: "Payment successful! Subscription activated.",
      institution,
    });
  } catch (error) {
    console.error('Error marking as paid:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error marking as paid',
      error: error.message,
    });
  }
};

