const Note = require("../model/notes");
const { STATUS_CODE, MESSAGES } = require("../contant");

const getNotes = async (req, res) => {
  const { userId } = req.params;
  try {
    const notes = await Note.find({ user: userId });
    if (!notes || notes.length === 0) {
      return res.status(404).json({ error: 'No notes found for this user' });
    }
    res.status(200).json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};



const createNote = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({ error: MESSAGES.REQUIRED_FIELDS });
  }

  try {
    const note = new Note({
      user: req.user.id,
      title,
      description,
    });

    const savedNote = await note.save();
    res.status(STATUS_CODE.CREATED).json(savedNote);
  } catch (err) {
    res.status(STATUS_CODE.SERVER_ERROR).json({ error: "Failed to create note." });
  }
};

const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const note = await Note.findById(id);

    if (!note) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({ error: "Note not found." });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({ error: "Not authorized." });
    }

    note.title = title || note.title;
    note.description = description || note.description;

    const updatedNote = await note.save();
    res.status(STATUS_CODE.OK).json(updatedNote);
  } catch (err) {
    res.status(STATUS_CODE.SERVER_ERROR).json({ error: "Failed to update note." });
  }
};

const deleteNote = async (req, res) => {
  const { id } = req.params;
  console.log(id)

  try {
    const note = await Note.findById(id);
    console.log(note)

    if (!note) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({ error: "Note not found." });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({ error: "Not authorized." });
    }

    await note.remove();
    res.status(STATUS_CODE.OK).json({ message: "Note deleted successfully." });
  } catch (err) {
    res.status(STATUS_CODE.SERVER_ERROR).json({ error: "Failed to delete note." });
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};
