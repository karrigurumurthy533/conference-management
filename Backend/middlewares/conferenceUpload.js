const multer = require("multer");

// Files are uploaded from memory to Cloudinary by conferenceCrudController.
// Keep the limit suitable for your hosting plan; large video uploads may need a higher plan/streaming upload.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB maximum per file
    files: 40,
  },
  fileFilter: (req, file, callback) => {
    const isImage = file.mimetype?.startsWith("image/");
    const isVideo = file.mimetype?.startsWith("video/");
    if (isImage || isVideo) return callback(null, true);
    return callback(new Error(`Unsupported conference media type: ${file.mimetype}`));
  },
});


module.exports = upload.any();
