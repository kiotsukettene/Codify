import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, institutionId) => {

    // token -> sign method -> payload, secret key, options
    const token = jwt.sign({ institutionId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })

    res.cookie("token", token, {
        httpOnly: true, // means cannot be accesible via javascript, only http
        secure: process.env.NODE_ENV === 'production', // only works in https
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    return token;
};