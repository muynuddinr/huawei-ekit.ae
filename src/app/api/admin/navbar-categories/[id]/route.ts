import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import NavbarCategory from '@/app/models/NavbarCategory';
import { checkAdminAuth, createAuthResponse } from '@/lib/auth';
import mongoose from 'mongoose';

// GET - Fetch single navbar category (public)
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

    const category = await NavbarCategory.findById(id);

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
    console.error('Error fetching navbar category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PATCH - Update navbar category (admin only)
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
    const { name, description, order, isActive } = body;
    
    console.log('PATCH request received for category ID:', id);
    console.log('Request body:', body);
    console.log('Extracted values:', { name, description, order, isActive });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await NavbarCategory.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check for duplicate name if name is being updated
    if (name && name.trim() !== category.name) {
      const existingCategory = await NavbarCategory.findOne({ 
        name: name.trim(),
        _id: { $ne: id }
      });

      if (existingCategory) {
        return NextResponse.json(
          { success: false, error: 'Category with this name already exists' },
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
    if (description !== undefined) updateData.description = description.trim();
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) {
      updateData.isActive = isActive;
      console.log(`Setting isActive to: ${isActive} (type: ${typeof isActive})`);
    }

    console.log('Update data prepared:', updateData);
    console.log('Category ID to update:', id);

    const updatedCategory = await NavbarCategory.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

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
      slug: updatedCategory.slug
    });

    // Verify the update by reading from database again
    const verifyCategory = await NavbarCategory.findById(id);
    console.log('Verification - Category in DB:', {
      name: verifyCategory?.name,
      isActive: verifyCategory?.isActive
    });

    return NextResponse.json({ 
      success: true, 
      data: updatedCategory,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating navbar category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE - Delete navbar category (admin only)
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

    const deletedCategory = await NavbarCategory.findByIdAndDelete(id);

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
    console.error('Error deleting navbar category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}