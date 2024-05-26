import dotenv from "dotenv";
import fs from "fs";
dotenv.config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
export async function uploadImageToCloudinary(image) {
  const imageUrl = await cloudinary.uploader.upload(
    image,
    { folder: "samples" },
    (error, result) => {
      if (error) {
        throw new Error("Error while Uploading the image in cloudinary");
      } else {
        console.log("Image uploaded successfully:", result.url);
        fs.unlink(image, (err) => {
          if (error) {
            console.error("Error deleting file:", error);
          } else {
            console.log("File deleted successfully");
          }
        });
        return { result: result.url, message: "Upload SuccessFully !!!" };
      }
    }
  );
  return imageUrl.url;
}
