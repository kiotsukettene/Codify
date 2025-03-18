import jwt from "jsonwebtoken";

export const generateStudentTokenAndSetCookie = (res, studentId) => {
    const token = jwt.sign({ studentId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("studentToken", token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return token;
};