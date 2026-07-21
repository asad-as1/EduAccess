const ShortNote = require('../models/ShortNote');
const User = require('../models/User');

// Create a new short note
exports.createShortNote = async (req, res) => {
    try {
        const { title, shortNote, fileUrl, publicId } = req.body.noteData;
        // console.log(req.body)
        const author = req.user.id; 

        if (!shortNote && !fileUrl) {
            return res.status(400).json({ message: 'Either shortNote or fileUrl must be provided' });
        }

        const newShortNote = new ShortNote({
            title,
            shortNote,
            fileUrl,
            publicId: publicId || null,
            author
        });

        await newShortNote.save();

        // Add shortNote ID to user's model
        await User.findByIdAndUpdate(author, { $push: { shortNotes: newShortNote._id } });

        res.status(201).json(newShortNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all short notes of the logged-in user
exports.getAllShortNotes = async (req, res) => {
    try {
        // console.log(req.user)
        const shortNotes = await ShortNote.find({ author: req.user.id });
        res.status(200).json(shortNotes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single short note by ID
exports.getShortNoteById = async (req, res) => {
    try {
        // console.log(req.body)
        const shortNote = await ShortNote.findById(req.params.id);
        if (!shortNote) return res.status(404).json({ message: 'Short note not found' });
        res.status(200).json(shortNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a short note
exports.updateShortNote = async (req, res) => {
    try {
        const { title, shortNote, fileUrl, publicId } = req.body.updatedNoteData;
        // console.log(title, shortNote, fileUrl)

        if (!shortNote && !fileUrl) {
            return res.status(400).json({ message: 'Either shortNote or fileUrl must be provided' });
        }
        const updatedShortNote = await ShortNote.findByIdAndUpdate(
            req.params.id,
            { title, shortNote, fileUrl, publicId },
            { new: true, runValidators: true }
        );
        if (!updatedShortNote) return res.status(404).json({ message: 'Short note not found' });
        res.status(200).json(updatedShortNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a short note
exports.deleteShortNote = async (req, res) => {
    try {
        // console.log(req.body)
        const deletedShortNote = await ShortNote.findByIdAndDelete(req.params.id);
        if (!deletedShortNote) return res.status(404).json({ message: 'Short note not found' });

        // Remove shortNote ID from user's model
        await User.findByIdAndUpdate(deletedShortNote.author, { $pull: { shortNotes: deletedShortNote._id } });

        res.status(200).json({ message: 'Short note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get all short notes of all users
exports.getAllUsersNotes = async (req, res) => {
    try {
        // console.log(req.user)
        const shortNotes = await ShortNote.find()
        .populate({
          path: 'author', // Populate the 'author' field
          select: 'username fullName role' // Select fields from 'author'
        });
        // console.log(shortNotes)
        res.status(200).json(shortNotes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
