import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/app/models/Category';
import NavbarCategory from '@/app/models/NavbarCategory';
import { checkAdminAuth, createAuthResponse } from '@/lib/auth';

// GET - Fetch categories (public: active only, admin: all)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Check if request is from authenticated admin
    const isAdmin = await checkAdminAuth(request);
    
    // Debug: Show all categories in database
    const allCategories = await Category.find({})
      .populate('navbarCategory', 'name slug')
      .select('name slug navbarCategory description image isActive createdAt updatedAt');
    console.log('ALL categories in database:', allCategories.map(cat => ({ 
      name: cat.name, 
      navbarCategory: (cat.navbarCategory as any)?.name,
      isActive: cat.isActive,
      slug: cat.slug 
    })));
    
    let query = {};
    let selectFields = 'name slug navbarCategory description image isActive createdAt updatedAt';
    
    if (isAdmin) {
      // Admin can see all categories with all fields
      console.log('Admin request: returning all categories');
      // No filter - return all categories
    } else {
      // Public request - only active categories with limited fields
      console.log('Public request: returning only active categories');
      query = { isActive: true };
      selectFields = 'name slug navbarCategory description image';
    }
    
    const categories = await Category.find(query)
      .populate('navbarCategory', 'name slug')
      .sort({ createdAt: -1 })
      .select(selectFields);

    console.log(`Returning ${categories.length} categories for ${isAdmin ? 'admin' : 'public'} request`);
    console.log('Categories returned:', categories.map(cat => ({ 
      name: cat.name, 
      navbarCategory: (cat.navbarCategory as any)?.name,
      isActive: cat.isActive,
      slug: cat.slug 
    })));

    return NextResponse.json({ 
      success: true, 
      data: categories 
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create new category (admin only)
export async function POST(request: NextRequest) {
  try {
    console.log('POST request received for creating category');
    
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
    const { name, navbarCategory, description, image } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    if (!navbarCategory) {
      return NextResponse.json(
        { success: false, error: 'NavbarCategory is required' },
        { status: 400 }
      );
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
    const categorySlug = name.trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if category with same slug already exists
    const existingCategory = await Category.findOne({ slug: categorySlug });
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'A category with this name (slug) already exists' },
        { status: 400 }
      );
    }

    console.log('Creating new category...');
    // Create new category
    const newCategory = new Category({
      name: name.trim(),
      slug: categorySlug,
      navbarCategory,
      description: description?.trim() || '',
      image: image || '',
      isActive: true
    });

    console.log('About to save category:', {
      name: newCategory.name,
      slug: newCategory.slug,
      navbarCategory: newCategory.navbarCategory,
      description: newCategory.description,
      isActive: newCategory.isActive
    });

    await newCategory.save();
    
    // Populate navbarCategory before returning
    await newCategory.populate('navbarCategory', 'name slug');
    
    console.log('Category saved successfully:', {
      id: newCategory._id,
      name: newCategory.name,
      slug: newCategory.slug,
      navbarCategory: (newCategory.navbarCategory as any)?.name
    });

    return NextResponse.json({ 
      success: true, 
      data: newCategory,
      message: 'Category created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { success: false, error: 'Failed to create category', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
