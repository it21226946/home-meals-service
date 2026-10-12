import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const CLOUDINARY_CONFIG_MESSAGE =
  "Image uploads require Cloudinary. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.";

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

let configuredMulter = null;
let memoryMulter = null;

function getConfiguredMulter() {
  if (!configuredMulter) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const storage = new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => {
        let folderName = "others";
        if (req.originalUrl.includes("meal-request")) folderName = "meal_requests";
        else if (req.originalUrl.includes("meal")) folderName = "meals";
        else if (req.originalUrl.includes("user")) folderName = "profile_pics";
        else if (req.originalUrl.includes("review")) folderName = "reviews";
        else if (req.originalUrl.includes("finance")) folderName = "bank_slips";
        else if (req.originalUrl.includes("orders")) folderName = "order_receipts";
        else if (req.originalUrl.includes("special-alert")) folderName = "special_alerts";

        return {
          folder: folderName,
          allowed_formats: ["jpg", "jpeg", "png"],
          resource_type: "image",
        };
      },
    });

    configuredMulter = multer({ storage });
  }
  return configuredMulter;
}

function getMemoryMulter() {
  if (!memoryMulter) {
    memoryMulter = multer({ storage: multer.memoryStorage() });
  }
  return memoryMulter;
}

/** Multer-compatible upload: optional files work without Cloudinary; files require Cloudinary. */
export const upload = {
  single(fieldName) {
    return (req, res, next) => {
      const parser = isCloudinaryConfigured()
        ? getConfiguredMulter().single(fieldName)
        : getMemoryMulter().single(fieldName);

      parser(req, res, (err) => {
        if (err) {
          return next(err);
        }
        if (req.file && !isCloudinaryConfigured()) {
          return res.status(503).json({
            success: false,
            message: CLOUDINARY_CONFIG_MESSAGE,
          });
        }
        next();
      });
    };
  },
};
