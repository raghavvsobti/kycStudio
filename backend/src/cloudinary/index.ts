import cloudinary from 'cloudinary';
import multer from 'multer';

const storage = multer.memoryStorage(); // Store files in memory before uploading to Cloudinary
export const uploadFile = multer({ storage }).single('file'); // Single file upload with field name 'file'

export const uploadToCloudinary = async (file: Express.Multer.File) => {
    return new Promise<any>((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
            { resource_type: 'auto' }, // Automatically detect resource type
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(file.buffer);
    });
};