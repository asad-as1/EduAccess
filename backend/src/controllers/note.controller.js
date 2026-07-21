const Note = require("../models/Note");

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, description, file, publicId } = req.body.newNote;
    // console.log(title, description, file)

    if (!title || !description || !file) {

      return res.status(400).json({ message: "All fields are required." });
    }

    const newNote = new Note({
      title,
      description,
      file,
      publicId: publicId || null,
      author: req?.user?.id,
    });


    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// Get all notes
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().populate("author", "username email").sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    // console.log(req.user)
    const { noteId } = req.body;
    if (!noteId) {
      return res.status(400).json({ message: "Note ID are required." });
    }
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    // Check if the logged-in user is the owner of the note
    if (note.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized to delete this note." });
    }

    await Note.findByIdAndDelete(noteId);

    res.status(200).json({ message: "Note successfully deleted." });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
};
