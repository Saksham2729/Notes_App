const mongoose = require('mongoose');
const { Schema } = mongoose;

const noteSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Note', noteSchema);


