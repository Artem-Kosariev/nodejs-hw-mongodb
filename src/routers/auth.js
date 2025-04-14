import express from 'express';
import multer from 'multer';
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  sendResetEmail,
  resetPassword,
} from '../controllers/auth.js';
import {
  validateRegistration,
  validateLogin,
} from '../validation/userValidation.js';

const router = express.Router();
const upload = multer().none();

router.post('/register', upload, validateRegistration, registerUser);
router.post('/login', upload, validateLogin, loginUser);
router.post('/refresh', upload, refreshSession);
router.post('/logout', upload, logoutUser);
router.post('/send-reset-email', upload, sendResetEmail);
router.post('/reset-pwd', upload, resetPassword);

export default router;
