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
        console.log('🔄 Upload attempt for file:', localFilePath);
        
        if (!localFilePath) {
            console.log('❌ No file path provided');
            return null;
        }
        
        // Check if file exists
        if (!fs.existsSync(localFilePath)) {
            console.log('❌ File does not exist:', localFilePath);
            return null;
        }
        
        // Check if Cloudinary is configured
        if (!process.env.CLOUDINARY_CLOUD_NAME || 
            process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name') {
            console.log('⚠️  Cloudinary not configured, returning placeholder');
            // Clean up local file
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
            // Return a more informative placeholder image URL
            const placeholder = {
                url: 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Upload+Successful%0ACloudinary+Not+Configured',
                public_id: 'placeholder_not_configured'
            };
            console.log('📷 Returning placeholder:', placeholder.url);
            return placeholder;
        }
        
        // upload the file to Cloudinary
        console.log('☁️  Uploading to Cloudinary...');
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });
        
        // file has been uploaded successfully
        console.log('✅ File uploaded successfully to Cloudinary');
        console.log('📷 Cloudinary URL:', response.url);
        console.log('🆔 Public ID:', response.public_id);
        fs.unlinkSync(localFilePath); // remove the locally saved file after upload
        return response;
    } catch (error) {
        console.error('❌ Cloudinary upload error:', error.message);
        
        // Check if it's an authentication error
        if (error.message.includes('Invalid Signature')) {
            console.error('🔑 Cloudinary authentication failed - check your API credentials in .env file');
        }
        
        // Clean up local file
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        
        // Return a fallback placeholder even on error
        const errorPlaceholder = {
            url: 'https://via.placeholder.com/400x300/f87171/ffffff?text=Upload+Failed%0ACheck+Cloudinary+Credentials',
            public_id: 'cloudinary_error_placeholder'
        };
        console.log('📷 Returning error placeholder:', errorPlaceholder.url);
        return errorPlaceholder;
    }
}

export { uploadOnCloudinary };