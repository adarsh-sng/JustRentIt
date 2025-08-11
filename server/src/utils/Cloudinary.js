import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Only configure cloudinary if credentials are provided
if (process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name') {
    
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log('✅ Cloudinary configured successfully');
} else {
    console.log('⚠️  Cloudinary not configured - image uploads will be skipped');
}

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        
        // Check if Cloudinary is configured
        if (!process.env.CLOUDINARY_CLOUD_NAME || 
            process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name') {
            console.log('⚠️  Cloudinary not configured, skipping upload');
            // Clean up local file
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
            // Return a placeholder image URL or null
            return {
                url: 'https://via.placeholder.com/400x300?text=Image+Upload+Disabled',
                public_id: 'placeholder'
            };
        }
        
        // upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });
        
        // file has been uploaded successfully
        console.log('✅ File uploaded successfully to Cloudinary');
        fs.unlinkSync(localFilePath); // remove the locally saved file after upload
        return response;
    } catch (error) {
        console.error('❌ Cloudinary upload error:', error.message);
        // Clean up local file
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
}

export { uploadOnCloudinary };