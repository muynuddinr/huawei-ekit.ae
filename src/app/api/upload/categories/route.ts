import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    console.log('Category image upload request received');
    
    // Check JWT authentication
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Admin authentication required' 
      }, { status: 401 });
    }

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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'huawei-ekit/categories',
          public_id: `category-${Date.now()}-${Math.random().toString(36).substring(2)}`,
          overwrite: true,
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    const result = await uploadPromise as any;
    
    return NextResponse.json({ 
      success: true,
      message: 'Category image uploaded successfully',
      imagePath: result.secure_url,
      cloudinaryData: {
        public_id: result.public_id,
        version: result.version,
        width: result.width,
        height: result.height
      }
    });
    
  } catch (error) {
    console.error('Category image upload error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
