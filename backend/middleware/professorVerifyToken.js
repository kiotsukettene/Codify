import jwt from "jsonwebtoken";

export const profVerifyToken = (req, res, next) => {
  console.log("Cookies received:", req.cookies);
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    req.professorId = decoded.professorId;
    next();
  } catch (error) {
    console.error("Error verifying professor token", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid token",
    });
  }
};
