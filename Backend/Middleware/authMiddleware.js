import jwt from 'jsonwebtoken';
import { User } from '../model/user.js';
import { STATUS_CODE, MESSAGES } from "../contant.js";

/**
 * Middleware to protect routes by verifying JWT token.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const protect = async (req, res, next) => {
  try {
    // Get token from the Authorization header
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json({ success: false, message: MESSAGES.UNAUTHORIZED });
    }

    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by decoded ID and exclude password
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res
        .status(STATUS_CODE.PAGE_NOT_FOUND)
        .json({ success: false, message: MESSAGES.NOT_FOUND });
    }

    // Attach user information to request object
    req.userId = user._id;
    req.user = user;

    next(); // Proceed to next middleware
  } catch (error) {
    console.error('Error verifying token:', error);
    return res
      .status(STATUS_CODE.UNAUTHORIZED)
      .json({ success: false, message: MESSAGES.INVALID_TOKEN });
  }
};


