const express = require('express');
const router = express.Router();
const multer = require('multer');

const { authenticate } = require('../middlewares/auth');
const cloudinaryController = require('../controllers/cloudinary.controller');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload a file (image/video/doc) to Cloudinary
// Expects multipart/form-data with field name: file
// NOTE: upload.single('file') MUST come before authenticate so multer parses
// the multipart body first, making req.body.token available to authenticate.
router.post('/upload', upload.single('file'), authenticate, cloudinaryController.uploadToCloudinary);

// Delete a file from Cloudinary by public_id
router.post('/delete', authenticate, cloudinaryController.deleteFromCloudinary);

module.exports = router;
