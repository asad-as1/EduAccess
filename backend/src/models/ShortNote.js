const mongoose = require('mongoose');

const shortNoteSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    shortNote: {
      type: String,
      required: false,
    },
    fileUrl: {
      type: String, 
      required: false,
    },
    publicId: {
      type: String,
      required: false,
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
  
  const ShortNote = mongoose.model('ShortNote', shortNoteSchema);
  module.exports = ShortNote;
  