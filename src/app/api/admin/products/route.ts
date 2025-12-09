import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product, Category, SubCategory, NavbarCategory } from '@/app/models';
import { checkAdminAuth, createAuthResponse } from '@/lib/auth';
import mongoose from 'mongoose';

// GET - Fetch products (public: active only, admin: all)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Check if request is from authenticated admin
    const isAdmin = await checkAdminAuth(request);
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Debug: Show all products in database
    const allProducts = await Product.find({})
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .populate('navbarCategory', 'name slug')
      .select('name slug category subcategory navbarCategory keyFeatures image1 isActive createdAt updatedAt');
    console.log('ALL products in database:', allProducts.map(product => ({ 
      name: product.name, 
      category: (product.category as any)?.name,
      subcategory: (product.subcategory as any)?.name,
      navbarCategory: (product.navbarCategory as any)?.name,
      isActive: product.isActive,
      slug: product.slug 
    })));
    
    let query = {};
    let selectFields = 'name slug category subcategory navbarCategory description keyFeatures image1 image2 image3 image4 isActive createdAt updatedAt';
    
    if (isAdmin) {
      // Admin can see all products with all fields
      console.log('Admin request: returning all products');
      // No filter - return all products
    } else {
      // Public request - only active products with limited fields
      console.log('Public request: returning only active products');
      query = { isActive: true };
      selectFields = 'name slug category subcategory navbarCategory description keyFeatures image1';
    }
    
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .populate('navbarCategory', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .select(selectFields);

    // Get total count
    const total = await Product.countDocuments(query);

    console.log(`Returning ${products.length} products for ${isAdmin ? 'admin' : 'public'} request`);

    return NextResponse.json({ 
      success: true, 
      data: products,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create new product (admin only)
export async function POST(request: NextRequest) {
  try {
    console.log('POST request received for creating product');
    
    // Check admin authentication
    const isAuthenticated = await checkAdminAuth(request);
    if (!isAuthenticated) {
      console.log('Authentication failed');
      return createAuthResponse('Admin authentication required');
    }

    console.log('Authentication passed');
    await connectDB();
    console.log('Database connected');
    
    const body = await request.json();
    console.log('Request body:', body);
    const { 
      name, 
      description, 
      keyFeatures,
      category, 
      subcategory, 
      navbarCategory, 
      image1, 
      image2, 
      image3, 
      image4 
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Product name is required' },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category is required' },
        { status: 400 }
      );
    }

    if (!navbarCategory) {
      return NextResponse.json(
        { success: false, error: 'NavbarCategory is required' },
        { status: 400 }
      );
    }

    // Verify category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Selected Category does not exist' },
        { status: 400 }
      );
    }

    // Verify subcategory exists (if provided)
    if (subcategory) {
      const existingSubCategory = await SubCategory.findById(subcategory);
      if (!existingSubCategory) {
        return NextResponse.json(
          { success: false, error: 'Selected SubCategory does not exist' },
          { status: 400 }
        );
      }
    }

    // Verify navbar category exists
    const existingNavbarCategory = await NavbarCategory.findById(navbarCategory);
    if (!existingNavbarCategory) {
      return NextResponse.json(
        { success: false, error: 'Selected NavbarCategory does not exist' },
        { status: 400 }
      );
    }

    // Generate slug
    const productSlug = name.trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if product with same slug already exists
    const existingProduct = await Product.findOne({ slug: productSlug });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: 'A product with this name (slug) already exists' },
        { status: 400 }
      );
    }

    console.log('Creating new product...');
    // Create new product
    const newProduct = new Product({
      name: name.trim(),
      slug: productSlug,
      description: description?.trim() || '',
      keyFeatures: keyFeatures || [],
      category,
      subcategory: subcategory || null,
      navbarCategory,
      image1: image1?.trim() || '',
      image2: image2?.trim() || '',
      image3: image3?.trim() || '',
      image4: image4?.trim() || '',
      isActive: true
    });

    console.log('About to save product:', {
      name: newProduct.name,
      slug: newProduct.slug,
      category: newProduct.category,
      subcategory: newProduct.subcategory,
      navbarCategory: newProduct.navbarCategory,
      keyFeatures: newProduct.keyFeatures,
      isActive: newProduct.isActive
    });

    await newProduct.save();
    
    // Populate references before returning
    await newProduct.populate([
      { path: 'category', select: 'name slug' },
      { path: 'subcategory', select: 'name slug' },
      { path: 'navbarCategory', select: 'name slug' }
    ]);
    
    console.log('Product saved successfully:', {
      id: newProduct._id,
      name: newProduct.name,
      slug: newProduct.slug,
      category: (newProduct.category as any)?.name,
      subcategory: (newProduct.subcategory as any)?.name,
      navbarCategory: (newProduct.navbarCategory as any)?.name
    });

    return NextResponse.json({ 
      success: true, 
      data: newProduct,
      message: 'Product created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { success: false, error: 'Failed to create product', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// PUT - Update product (admin only)
export async function PUT(request: NextRequest) {
  try {
    console.log('PUT request received for updating product');
    
    // Check admin authentication
    const isAuthenticated = await checkAdminAuth(request);
    if (!isAuthenticated) {
      console.log('Authentication failed');
      return createAuthResponse('Admin authentication required');
    }

    await connectDB();
    
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Find and update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).populate([
      { path: 'category', select: 'name slug' },
      { path: 'subcategory', select: 'name slug' },
      { path: 'navbarCategory', select: 'name slug' }
    ]);

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    console.log('Product updated successfully:', {
      id: updatedProduct._id,
      name: updatedProduct.name,
      slug: updatedProduct.slug
    });

    return NextResponse.json({ 
      success: true, 
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product (admin only)
export async function DELETE(request: NextRequest) {
  try {
    console.log('DELETE request received for products');
    
    // Check admin authentication with JWT
    const isAuthenticated = await checkAdminAuth(request);
    if (!isAuthenticated) {
      console.log('Authentication failed');
      return createAuthResponse('Admin authentication required');
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const singleId = searchParams.get('id');
    
    // Handle single product deletion via query parameter
    if (singleId) {
      console.log('Single product deletion via query param:', singleId);
      
      const deletedProduct = await Product.findByIdAndDelete(singleId);

      if (!deletedProduct) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      console.log('Single product deleted successfully:', {
        id: deletedProduct._id,
        name: deletedProduct.name
      });

      return NextResponse.json({
        success: true,
        message: 'Product deleted successfully',
        data: { id: singleId, name: deletedProduct.name }
      });
    }

    // Handle bulk product deletion via request body
    const body = await request.json();
    const { ids } = body;
    
    console.log('Bulk deletion request for products:', ids);

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Product IDs array is required for bulk deletion' }, { status: 400 });
    }

    // Validate all IDs are valid MongoDB ObjectIds
    const invalidIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return NextResponse.json({ error: `Invalid product IDs: ${invalidIds.join(', ')}` }, { status: 400 });
    }

    const deleteResult = await Product.deleteMany({ _id: { $in: ids } });

    console.log('Bulk deletion completed:', {
      requested: ids.length,
      deleted: deleteResult.deletedCount
    });

    return NextResponse.json({
      success: true,
      message: `${deleteResult.deletedCount} product(s) deleted successfully`,
      data: {
        deletedCount: deleteResult.deletedCount,
        requestedCount: ids.length
      }
    });
  } catch (error) {
    console.error('Error deleting products:', error);
    return NextResponse.json({ error: 'Failed to delete products' }, { status: 500 });
  }
}

