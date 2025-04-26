import express from "express";
import {
  registerStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  logoutStudent,
  loginStudent,
  studentForgotPassword,
  studentRestPassword,
  studentCheckAuth,
  googleLogin,
} from "../controllers/student.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";
import { StudentVerifyToken } from "../middleware/studentVerifyToken.js";


const router = express.Router();


router.post("/register", verifyToken, registerStudent);
router.get("/list", verifyToken, getStudents);
router.get("/list/:id", verifyToken, getStudentById);
router.put("/list/update/:id", verifyToken, updateStudent);
router.delete("/list/delete/:id", verifyToken, deleteStudent);

router.post("/logoutStudent", logoutStudent);
router.post("/loginStudent", loginStudent);
router.post("/student-forgot-password", studentForgotPassword);
router.post("/student-reset-password/:token", studentRestPassword);
router.post("/student-google-login", googleLogin);
router.get("/student-check-auth", StudentVerifyToken, studentCheckAuth);




export default router;
