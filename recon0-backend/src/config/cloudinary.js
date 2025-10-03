// src/config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import 'dotenv/config';

// Configure Cloudinary with credentials from .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Export both the configured cloudinary instance and the multer upload middleware
export { cloudinary };
export default upload;