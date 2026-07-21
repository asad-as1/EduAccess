const cloudinary = require('../config/cloudinary');


// POST /cloudinary/upload
// Body: multipart/form-data with field 'file'
exports.uploadToCloudinary = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File is required.' });
    }

    // Folder in Cloudinary where files will be stored
    const folder = process.env.CLOUDINARY_FOLDER || 'files';

    const uploadResult = await new Promise((resolve, reject) => {
      const streamPromise = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamPromise.end(req.file.buffer);
    });

    // Store both secure_url and public_id so frontend/backend can delete later.
    return res.status(201).json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return res.status(500).json({ message: 'Cloudinary upload failed.' });
  }
};

// POST /cloudinary/delete
// Body: { publicId }
exports.deleteFromCloudinary = async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ message: 'No Cloudinary file to delete (publicId missing).' });
    }

    const normalizedPublicId = String(publicId).trim();
    const result = await cloudinary.uploader.destroy(normalizedPublicId);
    console.log('Cloudinary delete result for', normalizedPublicId, result);

    if (result?.result === 'ok' || result?.result === 'not_found') {
      return res.status(200).json({
        message: result.result === 'ok' ? 'Deleted from Cloudinary successfully.' : 'Cloudinary file was not found.',
        result,
      });
    }

    return res.status(500).json({ message: 'Cloudinary delete failed.', result });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return res.status(500).json({ message: 'Cloudinary delete failed.', error: error.message });
  }
};
