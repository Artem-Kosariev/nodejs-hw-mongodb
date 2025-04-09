import express from 'express';
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

router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/refresh', refreshSession);
router.post('/logout', logoutUser);
router.post('/send-reset-email', sendResetEmail);
router.post('/reset-pwd', resetPassword);

export default router;
