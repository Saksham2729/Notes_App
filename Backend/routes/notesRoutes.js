import express from 'express';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote
} from '../controller/notes.controller.js';
import { protect } from "../Middleware/authMiddleware.js"

const router = express.Router();

/**
 * @route POST /createNote
 * @desc Create a new note for the authenticated user
 * @access Private
 */
router.post('/createNote', protect, createNote);

/**
 * @route POST /getNote
 * @desc Retrieve notes for the authenticated user
 * @access Private
 */
router.post('/getNote', protect, getNotes);

/**
 * @route POST /delete
 * @desc Delete a note belonging to the authenticated user
 * @access Private
 */
router.post('/delete', protect, deleteNote);

/**
 * @route POST /update
 * @desc Update an existing note for the authenticated user
 * @access Private
 */
router.post('/update', protect, updateNote);

export default router;
