const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (
  file,
  folder = "globalscion/abstracts",
  resourceType = "auto"
) => {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result);
        }
      );

    uploadStream.end(file.buffer);
  });
};

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

    const versionIndex =
      publicId.indexOf("/");

    if (versionIndex !== -1) {
      publicId =
        publicId.substring(versionIndex + 1);
    }

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