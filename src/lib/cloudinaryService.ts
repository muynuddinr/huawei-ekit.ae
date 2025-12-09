import cloudinary from './cloudinary';

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  version: number;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export class CloudinaryService {
  /**
   * Upload image to Cloudinary
   */
  static async uploadImage(
    buffer: Buffer, 
    folder: string = 'huawei-ekit',
    options: any = {}
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder,
          public_id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
          overwrite: true,
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ],
          ...options
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload successful:', result?.public_id);
            resolve(result as CloudinaryUploadResult);
          }
        }
      ).end(buffer);
    });
  }

  /**
   * Delete image from Cloudinary
   */
  static async deleteImage(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log('Cloudinary delete result:', result);
      return result;
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw error;
    }
  }

  /**
   * Get image URL with transformations
   */
  static getOptimizedUrl(
    publicId: string, 
    width?: number, 
    height?: number, 
    quality: string = 'auto'
  ): string {
    return cloudinary.url(publicId, {
      width,
      height,
      crop: 'limit',
      quality,
      fetch_format: 'auto'
    });
  }

  /**
   * Extract public_id from Cloudinary URL
   */
  static extractPublicId(cloudinaryUrl: string): string | null {
    try {
      // Extract from URL like: https://res.cloudinary.com/dwc6f1b3r/image/upload/v1234567890/huawei-ekit/categories/abc123.jpg
      const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
      const match = cloudinaryUrl.match(regex);
      return match ? match[1] : null;
    } catch (error) {
      console.error('Error extracting public_id:', error);
      return null;
    }
  }
}

export default CloudinaryService;
