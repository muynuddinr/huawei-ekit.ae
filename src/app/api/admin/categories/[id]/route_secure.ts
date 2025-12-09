import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/app/models/Category';
import NavbarCategory from '@/app/models/NavbarCategory';
import { checkAdminAuth } from '@/lib/auth';
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
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    const category = await Category.findById(id)
      .populate('navbarCategory', 'name slug');

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: category 
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
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
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
    }

    await connectDB();
    
    const { id } = await params;
    const body = await request.json();
    const { name, navbarCategory, description, image, isActive } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    if (!navbarCategory || !mongoose.Types.ObjectId.isValid(navbarCategory)) {
      return NextResponse.json({ error: 'Valid navbar category is required' }, { status: 400 });
    }

    // Check if navbar category exists
    const navbarCategoryExists = await NavbarCategory.findById(navbarCategory);
    if (!navbarCategoryExists) {
      return NextResponse.json({ error: 'Navbar category not found' }, { status: 400 });
    }

    const updateData: any = {
      name: name.trim(),
      navbarCategory,
      description: description?.trim() || '',
      isActive: typeof isActive === 'boolean' ? isActive : true,
      updatedAt: new Date()
    };

    if (image && image.trim()) {
      updateData.image = image.trim();
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('navbarCategory', 'name slug');

    if (!updatedCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedCategory,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
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
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
    }

    await connectDB();
    
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Delete the category
    await Category.findByIdAndDelete(id);

    return NextResponse.json({ 
      success: true, 
      message: 'Category deleted successfully',
      data: { id, name: category.name }
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}