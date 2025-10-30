import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import NavbarCategory from '@/app/models/NavbarCategory';
import { checkAdminAuth, createAuthResponse } from '@/lib/auth';

// GET - Fetch navbar categories (public: active only, admin: all)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Check if request is from authenticated admin
    const isAdmin = await checkAdminAuth(request);
    
    // Debug: Always show all categories in database first
    const allCategories = await NavbarCategory.find({}).select('name isActive slug');
    console.log('ALL categories in database:', allCategories.map(cat => ({ 
      name: cat.name, 
      isActive: cat.isActive,
      slug: cat.slug 
    })));
    
    let query = {};
    let selectFields = 'name slug description order isActive createdAt updatedAt';
    
    if (isAdmin) {
      // Admin can see all categories with all fields
      console.log('Admin request: returning all categories');
      // No filter - return all categories
    } else {
      // Public request - only active categories with limited fields
      console.log('Public request: returning only active categories');
      query = { isActive: true };
      selectFields = 'name slug description order';
    }
    
    const categories = await NavbarCategory.find(query)
      .sort({ order: 1, createdAt: 1 })
      .select(selectFields);

    console.log(`Returning ${categories.length} categories for ${isAdmin ? 'admin' : 'public'} request`);
    console.log('Categories returned:', categories.map(cat => ({ 
      name: cat.name, 
      isActive: cat.isActive,
      slug: cat.slug 
    })));

    return NextResponse.json({ 
      success: true, 
      data: categories 
    });
  } catch (error) {
    console.error('Error fetching navbar categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create new navbar category (admin only)
export async function POST(request: NextRequest) {
  try {
    console.log('POST request received');
    
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
    const { name, description, order } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Check if category with same name already exists
    const existingCategory = await NavbarCategory.findOne({ 
      name: name.trim() 
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category with this name already exists' },
        { status: 400 }
      );
    }

    // Generate slug and check for duplicates
    const categorySlug = name.trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existingSlug = await NavbarCategory.findOne({ 
      slug: categorySlug 
    });

    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: 'A category with this name (slug) already exists' },
        { status: 400 }
      );
    }

    // Create new category      
    const newCategory = new NavbarCategory({
      name: name.trim(),
      slug: categorySlug,
      description: description?.trim() || '',
      order: order || 0,
      isActive: true
    });

    console.log('About to save category:', {
      name: newCategory.name,
      slug: newCategory.slug,
      description: newCategory.description,
      order: newCategory.order,
      isActive: newCategory.isActive
    });

    await newCategory.save();
    
    console.log('Category saved successfully:', {
      id: newCategory._id,
      name: newCategory.name,
      slug: newCategory.slug
    });

    return NextResponse.json({ 
      success: true, 
      data: newCategory,
      message: 'Category created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating navbar category:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { success: false, error: 'Failed to create category', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
