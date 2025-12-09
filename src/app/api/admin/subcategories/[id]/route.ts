import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SubCategory from '@/app/models/SubCategory';
import Category from '@/app/models/Category';
import { checkAdminAuth } from '@/lib/auth';

interface Params {
  params: Promise<{ id: string }>;
}

// GET - Fetch single subcategory
export async function GET(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    
    const { id } = await params;
    console.log('GET /api/admin/subcategories/[id] - ID:', id);

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'SubCategory ID is required'
      }, { status: 400 });
    }

    const subcategory = await SubCategory.findById(id)
      .populate({
        path: 'category',
        populate: {
          path: 'navbarCategory',
          select: 'name slug'
        }
      });

    if (!subcategory) {
      return NextResponse.json({
        success: false,
        error: 'SubCategory not found'
      }, { status: 404 });
    }

    console.log('SubCategory found:', {
      id: subcategory._id,
      name: subcategory.name,
      category: (subcategory.category as any)?.name
    });

    return NextResponse.json({
      success: true,
      message: 'SubCategory fetched successfully',
      data: subcategory
    });

  } catch (error) {
    console.error('GET /api/admin/subcategories/[id] error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch subcategory',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PATCH - Update subcategory
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    
    // Check admin authentication
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Admin authentication required'
      }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    console.log('PATCH /api/admin/subcategories/[id] - ID:', id);
    console.log('Update data:', body);

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'SubCategory ID is required'
      }, { status: 400 });
    }

    // Find existing subcategory
    const existingSubCategory = await SubCategory.findById(id);
    if (!existingSubCategory) {
      return NextResponse.json({
        success: false,
        error: 'SubCategory not found'
      }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};
    
    if (body.name && body.name.trim()) {
      updateData.name = body.name.trim();
      
      // If name is changed, generate new slug
      const baseSlug = updateData.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Ensure unique slug (excluding current record)
      let slug = baseSlug;
      let counter = 1;
      while (await SubCategory.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }

    if (body.category) {
      // Verify category exists
      const categoryExists = await Category.findById(body.category);
      if (!categoryExists) {
        return NextResponse.json({
          success: false,
          error: 'Selected category does not exist'
        }, { status: 400 });
      }
      updateData.category = body.category;
    }

    if (body.description !== undefined) {
      updateData.description = body.description.trim();
    }

    if (body.image !== undefined) {
      updateData.image = body.image.trim();
    }

    if (body.isActive !== undefined) {
      updateData.isActive = Boolean(body.isActive);
    }

    console.log('Final update data:', updateData);

    // Update subcategory
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate({
      path: 'category',
      populate: {
        path: 'navbarCategory',
        select: 'name slug'
      }
    });

    if (!updatedSubCategory) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update subcategory'
      }, { status: 500 });
    }

    console.log('SubCategory updated successfully:', {
      id: updatedSubCategory._id,
      name: updatedSubCategory.name,
      slug: updatedSubCategory.slug,
      isActive: updatedSubCategory.isActive
    });

    return NextResponse.json({
      success: true,
      message: 'SubCategory updated successfully',
      data: updatedSubCategory
    });

  } catch (error) {
    console.error('PATCH /api/admin/subcategories/[id] error:', error);
    
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json({
        success: false,
        error: 'SubCategory with this slug already exists'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to update subcategory',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE - Delete subcategory
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    
    // Check admin authentication
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Admin authentication required'
      }, { status: 401 });
    }

    const { id } = await params;
    console.log('DELETE /api/admin/subcategories/[id] - ID:', id);

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'SubCategory ID is required'
      }, { status: 400 });
    }

    // Check if subcategory exists
    const subcategory = await SubCategory.findById(id);
    if (!subcategory) {
      return NextResponse.json({
        success: false,
        error: 'SubCategory not found'
      }, { status: 404 });
    }

    // TODO: Check if there are products linked to this subcategory
    // For now, we'll allow deletion

    // Delete the subcategory
    await SubCategory.findByIdAndDelete(id);

    console.log('SubCategory deleted successfully:', {
      id: subcategory._id,
      name: subcategory.name,
      slug: subcategory.slug
    });

    return NextResponse.json({
      success: true,
      message: 'SubCategory deleted successfully',
      data: {
        id: subcategory._id,
        name: subcategory.name
      }
    });

  } catch (error) {
    console.error('DELETE /api/admin/subcategories/[id] error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete subcategory',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}