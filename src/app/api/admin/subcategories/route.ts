import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SubCategory from '@/app/models/SubCategory';
import Category from '@/app/models/Category';
import { checkAdminAuth } from '@/lib/auth';

// GET - Fetch subcategories (public: active only, admin: all)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Check if request is from authenticated admin
    const isAdmin = await checkAdminAuth(request);
    
    // Debug: Show all subcategories in database
    const allSubCategories = await SubCategory.find({})
      .populate({
        path: 'category',
        populate: {
          path: 'navbarCategory',
          select: 'name slug'
        }
      })
      .select('name slug category description image isActive createdAt updatedAt');
    
    console.log('ALL subcategories in database:', allSubCategories.map(sub => ({ 
      name: sub.name, 
      category: (sub.category as any)?.name,
      navbarCategory: (sub.category as any)?.navbarCategory?.name,
      isActive: sub.isActive,
      slug: sub.slug 
    })));
    
    let query = {};
    let selectFields = 'name slug category description image isActive createdAt updatedAt';
    
    if (isAdmin) {
      // Admin can see all subcategories with all fields
      console.log('Admin request: returning all subcategories');
      // No filter - return all subcategories
    } else {
      // Public request - only active subcategories with limited fields
      console.log('Public request: returning only active subcategories');
      query = { isActive: true };
      selectFields = 'name slug category description image';
    }
    
    const subcategories = await SubCategory.find(query)
      .populate({
        path: 'category',
        populate: {
          path: 'navbarCategory',
          select: 'name slug'
        }
      })
      .sort({ createdAt: -1 })
      .select(selectFields);

    console.log(`Returning ${subcategories.length} subcategories for ${isAdmin ? 'admin' : 'public'} request`);
    console.log('SubCategories returned:', subcategories.map(sub => ({ 
      name: sub.name, 
      category: (sub.category as any)?.name,
      navbarCategory: (sub.category as any)?.navbarCategory?.name,
      isActive: sub.isActive,
      slug: sub.slug 
    })));

    return NextResponse.json({
      success: true,
      message: 'SubCategories fetched successfully',
      data: subcategories,
      count: subcategories.length
    });

  } catch (error) {
    console.error('GET /api/admin/subcategories error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch subcategories',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Create new subcategory
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { name, category, description, image } = body;

    console.log('POST /api/admin/subcategories - Request body:', body);

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({
        success: false,
        error: 'SubCategory name is required'
      }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category is required'
      }, { status: 400 });
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return NextResponse.json({
        success: false,
        error: 'Selected category does not exist'
      }, { status: 400 });
    }

    console.log('Category verification passed:', categoryExists.name);

    // Generate slug from name
    const baseSlug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Ensure unique slug
    let slug = baseSlug;
    let counter = 1;
    while (await SubCategory.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    console.log('Generated unique slug:', slug);

    // Create subcategory
    const subcategoryData = {
      name: name.trim(),
      slug,
      category,
      description: description?.trim() || '',
      image: image?.trim() || '',
      isActive: true
    };

    console.log('Creating subcategory with data:', subcategoryData);

    const newSubCategory = new SubCategory(subcategoryData);
    const savedSubCategory = await newSubCategory.save();
    
    // Populate the category data for response
    const populatedSubCategory = await SubCategory.findById(savedSubCategory._id)
      .populate({
        path: 'category',
        populate: {
          path: 'navbarCategory',
          select: 'name slug'
        }
      });

    console.log('SubCategory created successfully:', {
      id: savedSubCategory._id,
      name: savedSubCategory.name,
      slug: savedSubCategory.slug,
      category: categoryExists.name
    });

    return NextResponse.json({
      success: true,
      message: 'SubCategory created successfully',
      data: populatedSubCategory
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/admin/subcategories error:', error);
    
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json({
        success: false,
        error: 'SubCategory with this slug already exists'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create subcategory',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
