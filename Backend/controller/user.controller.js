import { User } from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { REGEX, STATUS_CODE, MESSAGES, SUCCESS } from "../contant.js";

/**
 * Registers a new user in the system.
 *
 * @async
 * @function registerUser
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing user registration info.
 * @param {string} req.body.name - Name of the user.
 * @param {string} req.body.email - Email address of the user.
 * @param {string} req.body.password - Password provided by the user.
 * @param {string} req.body.confirmPassword - Confirmation of the password.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
export const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    if (!name || !email || !password || !confirmPassword) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        success: SUCCESS.FALSE,
        message: MESSAGES.REQUIRED_FIELDS,
        field: "general",
      });
    }

    if (!REGEX.EMAIL.test(email)) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        success: SUCCESS.FALSE,
        message: MESSAGES.INVALID_EMAIL,
        field: "email",
      });
    }

    if (password !== confirmPassword) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        success: SUCCESS.FALSE,
        message: MESSAGES.PASSWORD_MISMATCH,
        field: "confirmPassword",
      });
    }

    if (!REGEX.PASSWORD_COMPLEXITY.test(password)) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        success: SUCCESS.FALSE,
        message: MESSAGES.WEAK_PASSWORD,
        field: "password",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(STATUS_CODE.CONFLICT).json({
        success: SUCCESS.FALSE,
        message: MESSAGES.USER_EXISTS,
        field: "email",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res.status(STATUS_CODE.CREATED).json({
      success: SUCCESS.TRUE,
      message: MESSAGES.USER_CREATED,
      user: userResponse,
    });
  } catch (error) {
    res.status(STATUS_CODE.SERVER_ERROR).json({
      success: SUCCESS.FALSE,
      message: MESSAGES.SERVER_ERROR,
      error: error.message,
    });
  }
};

/**
 * Logs in a user by verifying credentials and returns a JWT token.
 *
 * @async
 * @function loginUser
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing login info.
 * @param {string} req.body.email - User's email.
 * @param {string} req.body.password - User's password.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        success: SUCCESS.FALSE,
        message: MESSAGES.LOGIN_REQUIRED,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: SUCCESS.FALSE,
        message: MESSAGES.INVALID_CREDENTIALS,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: SUCCESS.FALSE,
        message: MESSAGES.INVALID_CREDENTIALS,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      })
      .status(STATUS_CODE.OK)
      .json({
        success: SUCCESS.TRUE,
        message: MESSAGES.LOGIN_SUCCESS(user.name),
        userId: user._id,
        token: token,
      });

  } catch (error) {
    res.status(STATUS_CODE.SERVER_ERROR).json({
      success: SUCCESS.FALSE,
      message: MESSAGES.SERVER_ERROR,
      error: error.message,
    });
  }
};

/**
 * Logs out a user by clearing the authentication cookie.
 *
 * @function logoutUser
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
export const logoutUser = (req, res) => {
  res.clearCookie("token"); // optionally clear the cookie
  res.status(STATUS_CODE.CREATED).json({ message: "Logged out successfully" });
};
