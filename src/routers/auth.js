import express from 'express';
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
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

export default router;
