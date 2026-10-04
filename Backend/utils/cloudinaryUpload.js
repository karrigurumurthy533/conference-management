const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (
  file,
  folder = "globalscion/abstracts",
  resourceType = "auto"
) => {
  return new Promise((resolve, reject) => {
    try {
      if (!file) {
        return reject(new Error("File is required"));
      }

      // ============================================
      // GET BUFFER SAFELY
      // ============================================

      let buffer;

      // Multer file object
      if (file.buffer && Buffer.isBuffer(file.buffer)) {
        buffer = file.buffer;
      }

      // Direct Buffer
      else if (Buffer.isBuffer(file)) {
        buffer = file;
      }

      // ArrayBuffer
      else if (file instanceof ArrayBuffer) {
        buffer = Buffer.from(file);
      }

      // Uint8Array / TypedArray
      else if (ArrayBuffer.isView(file)) {
        buffer = Buffer.from(
          file.buffer,
          file.byteOffset,
          file.byteLength
        );
      }

      else {
        return reject(
          new Error("Invalid file format for Cloudinary upload")
        );
      }

      if (!buffer || buffer.length === 0) {
        return reject(
          new Error("Uploaded file is empty")
        );
      }

      // ============================================
      // CLOUDINARY UPLOAD STREAM
      // ============================================

      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: resourceType,
          },
          (error, result) => {
            if (error) {
              console.error(
                "Cloudinary upload error:",
                error
              );

              return reject(error);
            }

            resolve(result);
          }
        );

      // IMPORTANT:
      // Always send Node.js Buffer
      uploadStream.end(buffer);

    } catch (error) {
      console.error(
        "Cloudinary upload exception:",
        error
      );

      reject(error);
    }
  });
};


// ============================================
// DELETE FROM CLOUDINARY
// ============================================

const deleteFromCloudinary = async (
  fileUrl,
  resourceType = "image"
) => {
  try {
    if (!fileUrl) {
      return;
    }

    const uploadIndex =
      fileUrl.indexOf("/upload/");

    if (uploadIndex === -1) {
      return;
    }

    let publicId =
      fileUrl.substring(uploadIndex + 8);

    // Remove version
    const versionMatch =
      publicId.match(/^v\d+\/(.+)$/);

    if (versionMatch) {
      publicId = versionMatch[1];
    }

    // Remove extension
    publicId = publicId.replace(
      /\.[^/.]+$/,
      ""
    );

    await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: resourceType,
      }
    );

  } catch (error) {
    console.error(
      "Cloudinary delete error:",
      error.message
    );
  }
};


module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};