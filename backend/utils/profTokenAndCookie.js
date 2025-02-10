// import jwt from "jsonwebtoken";

// export const profTokenAndCookie = (res, professorId) => {
//   // token -> sign method -> payload, secret key, options
//   const token = jwt.sign({ professorId }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });

//   res.cookie("token", token, {
//     httpOnly: true, // means cannot be accesible via javascript, only http
//     secure: process.env.NODE_ENV === "production", // only works in https
//     sameSite: "strict",
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//   });

//   return token;
// };
import jwt from "jsonwebtoken";

export const profTokenAndCookie = (res, professorId) => {
  if (!res || typeof res.cookie !== "function") {
    console.error("profTokenAndCookie Error: Invalid res object");
    return null;
  }

  // Generate the JWT token
  const token = jwt.sign({ professorId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Set the token as a cookie
  res.cookie("token", token, {
    httpOnly: true, // Cannot be accessed via JavaScript, only HTTP
    secure: process.env.NODE_ENV === "production", // Only works in HTTPS
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
