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
