import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import httpErrors from 'http-errors';
import {
  createUserService,
  loginUserService,
  createSessionService,
  logoutSessionService,
  refreshSessionService,
} from '../services/auth.js';
import { sendEmail } from '../utils/sendEmail.js';
import User from '../db/models/user.js';

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await loginUserService(email);
    if (existingUser) {
      throw httpErrors(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUserService({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: { name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await loginUserService(email);
    if (!user) {
      throw httpErrors(401, 'Invalid email or password');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw httpErrors(401, 'Invalid email or password');
    }

    const { accessToken, refreshToken } = await createSessionService(user);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshSession = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw httpErrors(401, 'No refresh token found');
    }

    const { accessToken, newRefreshToken } = await refreshSessionService(
      refreshToken,
    );

    res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed session!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    await logoutSessionService(refreshToken);

    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log('[sendResetEmail] Request body:', req.body);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('[sendResetEmail] User not found:', email);
      return next(httpErrors(404, 'User not found'));
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '5m',
    });
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;
    console.log('[sendResetEmail] Generated resetLink:', resetLink);

    await sendEmail(user.email, resetLink);

    console.log('[sendResetEmail] Email successfully sent to:', user.email);
    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    console.error('[sendResetEmail] Fatal error:', error);
    next(httpErrors(500, 'Failed to send the email, please try again later.'));
  }
};
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return next(httpErrors(404, 'User not found!'));
    }

    // Захешируем пароль
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;

    await user.save();

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    return next(httpErrors(401, 'Token is expired or invalid.'));
  }
};
