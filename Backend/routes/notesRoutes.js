const express = require('express');
const router = express.Router();
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote
} = require('../controller/notes.controller');

// Middleware to protect routes 
const protect = require('../Middleware/authMiddleware');

// All routes are protected
router.route('/')
  .post(protect, createNote);

router.route('/:userId')
  .get(protect, getNotes)


router.route('/:id')
  .put(protect, updateNote)
  .delete(protect, deleteNote);

module.exports = router;
