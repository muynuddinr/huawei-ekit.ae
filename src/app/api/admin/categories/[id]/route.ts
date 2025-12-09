import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/app/models/Category';
import NavbarCategory from '@/app/models/NavbarCategory';
import { checkAdminAuth, createAuthResponse } from '@/lib/auth';
import mongoose from 'mongoose';

// GET - Fetch single category (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const category = await Category.findById(id)
      .populate('navbarCategory', 'name slug');

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: category 
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PATCH - Update category (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const isAuthenticated = await checkAdminAuth(request);
    if (!isAuthenticated) {
      return createAuthResponse('Admin authentication required');
    }

    await connectDB();
    
    const { id } = await params;
    const body = await request.json();
    const { name, navbarCategory, description, image, isActive } = body;
    
    console.log('PATCH request received for category ID:', id);
    console.log('Request body:', body);
    console.log('Extracted values:', { name, navbarCategory, description, image, isActive });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check for duplicate slug if name is being updated
    if (name && name.trim() !== category.name) {
      const newSlug = name.trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const existingCategory = await Category.findOne({ 
        slug: newSlug,
        _id: { $ne: id }
      });

      if (existingCategory) {
        return NextResponse.json(
          { success: false, error: 'Category with this name already exists' },
          { status: 400 }
        );
      }
    }

    // Verify navbar category exists if being updated
    if (navbarCategory && navbarCategory !== category.navbarCategory.toString()) {
      const existingNavbarCategory = await NavbarCategory.findById(navbarCategory);
      if (!existingNavbarCategory) {
        return NextResponse.json(
          { success: false, error: 'Selected NavbarCategory does not exist' },
          { status: 400 }
        );
      }
    }

    // Update category
    const updateData: any = {};
    if (name !== undefined) {
      updateData.name = name.trim();
      // Generate new slug when name is updated
      updateData.slug = name.trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    if (navbarCategory !== undefined) updateData.navbarCategory = navbarCategory;
    if (description !== undefined) updateData.description = description.trim();
    if (image !== undefined) updateData.image = image;
    if (isActive !== undefined) {
      updateData.isActive = isActive;
      console.log(`Setting isActive to: ${isActive} (type: ${typeof isActive})`);
    }

    console.log('Update data prepared:', updateData);
    console.log('Category ID to update:', id);

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('navbarCategory', 'name slug');

    if (!updatedCategory) {
      console.log('No category found with ID:', id);
      return NextResponse.json(
        { success: false, error: 'Category not found after update' },
        { status: 404 }
      );
    }

    console.log('Category updated successfully:', {
      id: updatedCategory._id,
      name: updatedCategory.name,
      isActive: updatedCategory.isActive,
      slug: updatedCategory.slug,
      navbarCategory: (updatedCategory.navbarCategory as any)?.name
    });

    // Verify the update by reading from database again
    const verifyCategory = await Category.findById(id).populate('navbarCategory', 'name slug');
    console.log('Verification - Category in DB:', {
      name: verifyCategory?.name,
      isActive: verifyCategory?.isActive,
      navbarCategory: (verifyCategory?.navbarCategory as any)?.name
    });

    return NextResponse.json({ 
      success: true, 
      data: updatedCategory,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { success: false, error: 'Failed to update category', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// DELETE - Delete category (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const isAuthenticated = await checkAdminAuth(request);
    if (!isAuthenticated) {
      return createAuthResponse('Admin authentication required');
    }

    await connectDB();
    
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}