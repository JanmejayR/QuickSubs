import express from 'express'
import { signUpController, loginController } from '../controllers/auth.controller.js';
const router = express.Router();

router.use('/signup' , signUpController)
router.use('/login' , loginController)

export default router;