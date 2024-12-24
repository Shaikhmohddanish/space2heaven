import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const addpropertyImages = async (file: Buffer): Promise<string | undefined> => {
  try {
    if (file) {
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const uploadImage = cloudinary.uploader.upload_stream(
          { folder: "Home2NestGallery" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        uploadImage.end(file); // Use `file` directly
      });

      return result.secure_url; // Return the secure URL directly
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
