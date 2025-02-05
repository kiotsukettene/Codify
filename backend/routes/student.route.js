import express from 'express';
import { registerStudent, getStudents, getStudentById, updateStudent, deleteStudent } from '../controllers/student.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/register', verifyToken,  registerStudent);
router.get('/list', verifyToken, getStudents);
router.get('/list/:id', verifyToken, getStudentById);
router.put('/list/update/:id', verifyToken, updateStudent);
router.delete('/list/delete/:id', verifyToken, deleteStudent);

export default router;