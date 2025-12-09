import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    console.log('Cloudinary upload request received');
    
    // Check JWT authentication
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      console.log('Upload authentication failed - no valid JWT token');
      return NextResponse.json({ 
        success: false, 
        error: 'Admin authentication required' 
      }, { status: 401 });
    }

    console.log('Upload authentication passed - valid admin JWT token');

    // Get the form data
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    
    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file received' 
      }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ 
        success: false, 
        error: 'File must be an image' 
      }, { status: 400 });
    }

    // Validate file size (max 10MB for Cloudinary)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        success: false, 
        error: 'File size must be less than 10MB' 
      }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'huawei-ekit/categories', // Organize in folders
          public_id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
          overwrite: true,
          transformation: [
            { width: 1200, height: 800, crop: 'limit' }, // Optimize image size
            { quality: 'auto' }, // Auto quality optimization
            { fetch_format: 'auto' } // Auto format optimization
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload successful:', result?.public_id);
            resolve(result);
          }
        }
      ).end(buffer);
    });

    const result = await uploadPromise as any;
    
    console.log(`File uploaded successfully to Cloudinary: ${result.secure_url}`);
    
    return NextResponse.json({ 
      success: true,
      message: 'Upload successful',
      imagePath: result.secure_url,
      cloudinaryData: {
        public_id: result.public_id,
        version: result.version,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      }
    });
    
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
