/**
 * Cấu hình Cloudinary cho upload 3D models
 * 
 * ⚠️ CẦN THAY ĐỔI:
 * 1. CLOUDINARY_CLOUD_NAME: Tên cloud của bạn
 * 2. CLOUDINARY_UPLOAD_PRESET: Upload preset của bạn
 * 3. CLOUDINARY_API_KEY: API key (nếu cần)
 */

import ENV from "./env";

export const CLOUDINARY_CONFIG = {
    CLOUD_NAME: ENV.CLOUDINARY_NAME,
    UPLOAD_PRESET: ENV.CLOUDINARY_UPLOAD_PRESET,
    API_KEY: ENV.CLOUDINARY_API_KEY,
    API_SECRET: ENV.CLOUDINARY_API_SECRET,

    
    // Folder chung cho tất cả file 3D
    FOLDERS: {
        ASSETS: '3d-assets' // Tất cả GLB, texture, accessory đều vào folder này
    },
    
    
    // Upload URL
    getUploadUrl: (resourceType: string = 'raw') => 
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/${resourceType}/upload`,
    
    
    // Giới hạn kích thước file
    FILE_SIZE_LIMITS: {
        // Cloudinary free plan limit: 10MB
        // Paid plans có thể lên đến 100MB+
        GLB: 10 * 1024 * 1024, // 10MB cho GLB (free plan)
        TEXTURE: 5 * 1024 * 1024, // 5MB cho texture
        // Nếu bạn có paid plan, có thể tăng lên:
        // GLB: 100 * 1024 * 1024, // 100MB cho GLB (paid plan)
    },
    
    // Cấu hình upload
    getUploadConfig: (folder: string, resourceType: string = 'raw') => ({
        upload_preset: CLOUDINARY_CONFIG.UPLOAD_PRESET,
        folder: folder,
        resource_type: resourceType,
        allowed_formats: resourceType === 'raw' ? ['glb', 'gltf'] : ['jpg', 'png', 'jpeg', 'webp'],
        // Sử dụng giới hạn từ FILE_SIZE_LIMITS
        max_file_size: resourceType === 'raw' ? CLOUDINARY_CONFIG.FILE_SIZE_LIMITS.GLB : CLOUDINARY_CONFIG.FILE_SIZE_LIMITS.TEXTURE,
    })
};

export default CLOUDINARY_CONFIG;
