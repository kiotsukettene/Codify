import jwt from 'jsonwebtoken';

export const StudentVerifyToken = (req, res, next) => {
    const token = req.cookies?.studentToken; // Ensure cookies exist
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - invalid token"
            }) 
        }
        req.studentId = decoded.studentId;
        next();
        
        
    } catch (error) {
        console.log("Error verifying token", error);
        return res.status(500).json({
            success: false,
            message: "Error verifying token"
        })
    }
}