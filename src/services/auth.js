import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';
import httpErrors from 'http-errors';

export const createUserService = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

export const loginUserService = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

export const createSessionService = async (user) => {
  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  const session = new Session({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  await session.save();
  return { accessToken, refreshToken };
};

export const refreshSessionService = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const session = await Session.findOneAndDelete({ refreshToken });

    if (!session) {
      throw httpErrors(401, 'Invalid refresh token');
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: '15m' },
    );
    const newRefreshToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: '30d' },
    );

    const newSession = new Session({
      userId: decoded.userId,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await newSession.save();
    return { accessToken, newRefreshToken };
  } catch (error) {
    throw httpErrors(401, 'Invalid refresh token');
  }
};

export const logoutSessionService = async (refreshToken) => {
  const session = await Session.findOneAndDelete({ refreshToken });
  if (!session) {
    throw httpErrors(401, 'Session not found');
  }
};
