import jwt from 'jsonwebtoken';
import httpErrors from 'http-errors';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token || !req.headers.authorization.startsWith('Bearer ')) {
      throw httpErrors(401, 'Access token required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(httpErrors(401, 'Access token expired'));
    }
    return next(httpErrors(401, 'Invalid or expired access token'));
  }
};
