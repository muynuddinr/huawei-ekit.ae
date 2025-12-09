import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/app/models/Product';
import { checkAdminAuth } from '@/lib/auth';
import mongoose from 'mongoose';

// GET - Fetch single product (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    // 🔒 SECURITY CHECK: Admin authentication required
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const product = await Product.findById(id)
      .populate('navbarCategory', 'name slug')
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug');

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PATCH - Update product (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    // 🔒 SECURITY CHECK: Admin authentication required
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate('navbarCategory', 'name slug')
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug');

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE - Delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    // 🔒 SECURITY CHECK: Admin authentication required
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully',
      data: { id, name: deletedProduct.name }
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

// PUT - Toggle product status (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('PUT request received for product status toggle');
    
    // Check admin authentication with JWT
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      console.log('Authentication failed');
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
    }

    await connectDB();
    
    const { id } = await params;
    console.log('Product ID to toggle status:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // Find the current product to get its current status
    const currentProduct = await Product.findById(id);
    
    if (!currentProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Toggle the isActive status
    const newStatus = !currentProduct.isActive;
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { 
        isActive: newStatus,
        updatedAt: new Date() 
      },
      { new: true, runValidators: true }
    )
      .populate('navbarCategory', 'name slug')
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug');

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Failed to update product status' }, { status: 500 });
    }

    console.log('Product status toggled successfully:', {
      id: updatedProduct._id,
      name: updatedProduct.name,
      oldStatus: currentProduct.isActive,
      newStatus: updatedProduct.isActive
    });

    return NextResponse.json({
      success: true,
      message: `Product ${newStatus ? 'activated' : 'deactivated'} successfully`,
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error toggling product status:', error);
    return NextResponse.json({ error: 'Failed to toggle product status' }, { status: 500 });
  }
}
