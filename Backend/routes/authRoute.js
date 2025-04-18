import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controller/user.controller.js';

const router = express.Router();

/**
 * @route POST /register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', registerUser);

/**
 * @route POST /login
 * @desc Log in an existing user
 * @access Public
 */
router.post('/login', loginUser);

/**
 * @route POST /logout
 * @desc Log out the current user
 * @access Private (should be protected by auth middleware if session-based or token invalidation logic applied)
 */
router.post('/logout', logoutUser);

export default router;
