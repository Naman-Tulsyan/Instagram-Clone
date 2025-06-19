import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    localFilePath = `./${localFilePath}`;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export const deleteImageFromCloudinary = async (cloudinaryURL) => {
  try {
    if (!cloudinaryURL) return null;
    const publicId = getPublicIdFromUrl(cloudinaryURL);

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    if (result.result !== "ok") {
      console.warn("Cloudinary failed to delete:", result);
      return null;
    }

    return true;
  } catch (error) {
    console.error("Cloudinary Deletion Error:", error);
    return null;
  }
};

export const getPublicIdFromUrl = (url) => {
  try {
    // Get everything after "/upload/"
    const afterUpload = url.split("/upload/")[1]; // e.g. v1749489786/rlkbrco9a0fxpu2w9caa.png

    // Split by "/" and remove version part
    const parts = afterUpload.split("/"); // [ 'v1749489786', 'rlkbrco9a0fxpu2w9caa.png' ]
    parts.shift(); // remove the version part

    const joined = parts.join("/"); // rlkbrco9a0fxpu2w9caa.png

    const publicId = joined.split(".").slice(0, -1).join("."); // remove extension only
    return publicId;
  } catch (e) {
    console.error("Invalid Cloudinary URL:", url);
    return null;
  }
};


