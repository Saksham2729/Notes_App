import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Mongoose schema for a Note.
 * Each note is associated with a user and contains a title and description.
 */
const noteSchema = new Schema({
  /**
   * Reference to the user who created the note
   * @type {mongoose.Schema.Types.ObjectId}
   * @required
   */
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  /**
   * Title of the note
   * @type {String}
   * @required
   */
  title: {
    type: String,
    required: true,
    trim: true
  },

  /**
   * Description/content of the note
   * @type {String}
   * @required
   */
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

/**
 * Note model - represents user notes in the database.
 */
const Note = mongoose.model('Note', noteSchema);

export default Note;
