const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    file: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: false,
    },

    description: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Note = mongoose.model('Note', NoteSchema);
  module.exports = Note;
  