const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the note'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content for the note'],
  },
  owner: {
    type: String, 
    required: [true, 'Please provide the owner of the note'],
  },
  owner_username: {
    type: String, 
    required: [true, 'Please provide the owner of the note'],
  },
  visibility: {
    type: String, 
    required: [true, 'Please provide the visibility for the note'],
  },
  lastEditedBy: { type: String, default: null },
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
