import Note from '../model/notes.js';
import { STATUS_CODE, MESSAGES } from '../contant.js';

/**
 * Get all notes for a specific user.
 *
 * @async
 * @function getNotes
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing the user ID.
 * @param {string} req.body.userId - ID of the user whose notes are to be fetched.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
export const getNotes = async (req, res) => {
  const { userId } = req.body;
  try {
    const notes = await Note.find({ user: userId });
    if (!notes || !notes.length) {
      return res.status(STATUS_CODE.PAGE_NOT_FOUND).json({ error: MESSAGES.NO_NOTE });
    }
    res.status(STATUS_CODE.OK).json(notes);
  } catch (err) {
    console.error(err);
    res.status(STATUS_CODE.SERVER_ERROR).json({ error: MESSAGES.SERVER_ERROR });
  }
};

/**
 * Create a new note.
 *
 * @async
 * @function createNote
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing note details.
 * @param {string} req.body.title - Title of the note.
 * @param {string} req.body.description - Description of the note.
 * @param {Object} req.user - Authenticated user object.
 * @param {string} req.user.id - ID of the authenticated user.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const createNote = async (req, res, next) => {
  try {
    const { title = '', description } = req.body;
    const { id: userId } = req.user;

    if (!title?.trim()) {
      return next(errorHandler(STATUS_CODE.BAD_REQUEST, "Title is required"));
    }

    if (!description?.trim()) {
      return next(errorHandler(STATUS_CODE.BAD_REQUEST, "Description is required"));
    }

    const note = await Note.create({ title, description, user: userId });

    res.status(STATUS_CODE.CREATED).json({
      success: true,
      message: MESSAGES.NOTE_ADDED,
      note,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing note.
 *
 * @async
 * @function updateNote
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing note details.
 * @param {string} req.body.id - ID of the note to be updated.
 * @param {string} [req.body.title] - New title (optional).
 * @param {string} [req.body.description] - New description (optional).
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
export const updateNote = async (req, res) => {
  const { id, title, description } = req.body;

  try {
    const note = await Note.findById(id);

    if (!note) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({ error: MESSAGES.NO_NOTE });
    }

    note.title = title || note.title;
    note.description = description || note.description;

    const updatedNote = await note.save();
    res.status(STATUS_CODE.OK).json(updatedNote);
  } catch (err) {
    res.status(STATUS_CODE.SERVER_ERROR).json({ error: MESSAGES.NOT_UPDATE_NOTE });
  }
};

/**
 * Delete an existing note.
 *
 * @async
 * @function deleteNote
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing note ID.
 * @param {string} req.body.id - ID of the note to delete.
 * @param {Object} req.user - Authenticated user object.
 * @param {string} req.user.id - ID of the authenticated user.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
export const deleteNote = async (req, res) => {
  const { id } = req.body;

  try {
    const note = await Note.findById(id);

    if (!note) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({ error: MESSAGES.NO_NOTE });
    }

    // Check ownership
    if (note.user.toString() !== req.user.id) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({ error: MESSAGES.NOT_AUTH });
    }

    await note.deleteOne();

    res.status(STATUS_CODE.CREATED).json({ message: MESSAGES.NOTE_DELETE });
  } catch (err) {
    console.error("Delete Note Error:", err);
    res.status(STATUS_CODE.SERVER_ERROR).json({ error: MESSAGES.FAIL_TO_DELETE });
  }
};
