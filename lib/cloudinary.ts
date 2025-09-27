import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Folder structure for different types of media
export const CLOUDINARY_FOLDERS = {
  PRODUCTS: 'uttarakhand-heritage/products',
  ARTISANS: 'uttarakhand-heritage/artisans',
  USERS: 'uttarakhand-heritage/users',
  INQUIRIES: 'uttarakhand-heritage/inquiries',
  GALLERY: 'uttarakhand-heritage/gallery',
  BLOG: 'uttarakhand-heritage/blog',
  TEMP: 'uttarakhand-heritage/temp'
} as const

// Upload options for different media types
export const UPLOAD_OPTIONS = {
  PRODUCT_IMAGE: {
    folder: CLOUDINARY_FOLDERS.PRODUCTS,
    transformation: [
      { width: 800, height: 600, crop: 'fill', quality: 'auto' },
      { format: 'webp' }
    ],
    resource_type: 'image' as const
  },
  ARTISAN_IMAGE: {
    folder: CLOUDINARY_FOLDERS.ARTISANS,
    transformation: [
      { width: 400, height: 400, crop: 'fill', quality: 'auto' },
      { format: 'webp' }
    ],
    resource_type: 'image' as const
  },
  USER_AVATAR: {
    folder: CLOUDINARY_FOLDERS.USERS,
    transformation: [
      { width: 200, height: 200, crop: 'fill', quality: 'auto' },
      { format: 'webp' }
    ],
    resource_type: 'image' as const
  },
  GALLERY_IMAGE: {
    folder: CLOUDINARY_FOLDERS.GALLERY,
    transformation: [
      { width: 1200, height: 800, crop: 'fill', quality: 'auto' },
      { format: 'webp' }
    ],
    resource_type: 'image' as const
  },
  DOCUMENT: {
    folder: CLOUDINARY_FOLDERS.INQUIRIES,
    resource_type: 'raw' as const
  }
} as const

// Helper functions for Cloudinary operations
export class CloudinaryService {
  // Upload image with specific options
  static async uploadImage(
    file: Buffer | string,
    options: typeof UPLOAD_OPTIONS[keyof typeof UPLOAD_OPTIONS]
  ) {
    try {
      const result = await cloudinary.uploader.upload(file, {
        ...options,
        use_filename: true,
        unique_filename: true,
        overwrite: false
      })
      return {
        success: true,
        data: {
          publicId: result.public_id,
          url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes
        }
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  }

  // Upload multiple images
  static async uploadMultipleImages(
    files: (Buffer | string)[],
    options: typeof UPLOAD_OPTIONS[keyof typeof UPLOAD_OPTIONS]
  ) {
    try {
      const uploadPromises = files.map(file => this.uploadImage(file, options))
      const results = await Promise.all(uploadPromises)
      
      const successful = results.filter(result => result.success)
      const failed = results.filter(result => !result.success)
      
      return {
        success: successful.length > 0,
        data: successful.map(result => result.data),
        errors: failed.map(result => result.error)
      }
    } catch (error) {
      console.error('Multiple upload error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Multiple upload failed'
      }
    }
  }

  // Delete image by public ID
  static async deleteImage(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId)
      return {
        success: result.result === 'ok',
        data: result
      }
    } catch (error) {
      console.error('Cloudinary delete error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed'
      }
    }
  }

  // Delete multiple images
  static async deleteMultipleImages(publicIds: string[]) {
    try {
      const result = await cloudinary.api.delete_resources(publicIds)
      return {
        success: result.deleted && Object.keys(result.deleted).length > 0,
        data: result
      }
    } catch (error) {
      console.error('Multiple delete error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Multiple delete failed'
      }
    }
  }

  // Get image info
  static async getImageInfo(publicId: string) {
    try {
      const result = await cloudinary.api.resource(publicId)
      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error('Get image info error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Get info failed'
      }
    }
  }

  // Generate optimized URL
  static getOptimizedUrl(publicId: string, transformations: any[] = []) {
    return cloudinary.url(publicId, {
      transformation: transformations,
      secure: true,
      quality: 'auto',
      fetch_format: 'auto'
    })
  }

  // Generate responsive image URLs
  static getResponsiveUrls(publicId: string, baseTransformations: any[] = []) {
    const sizes = [320, 640, 768, 1024, 1200, 1600]
    
    return sizes.map(width => ({
      width,
      url: cloudinary.url(publicId, {
        transformation: [
          ...baseTransformations,
          { width, crop: 'scale', quality: 'auto' }
        ],
        secure: true,
        quality: 'auto',
        fetch_format: 'auto'
      })
    }))
  }
}

export default cloudinary
