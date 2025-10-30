import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Category, NavbarCategory } from '@/app/models';

// GET - Fetch active categories with navbar category info (public endpoint)
export async function GET(request: NextRequest) {
  try {
    console.log('Public categories request received');
    await connectDB();
    
    // Public endpoint - only return active categories with populated navbar category info
    const categories = await Category.find({ isActive: true })
      .populate({
        path: 'navbarCategory',
        match: { isActive: true },
        select: 'name slug description order'
      })
      .select('name slug description image navbarCategory order')
      .sort({ order: 1, createdAt: -1 });

    // Filter out categories where navbar category is null (inactive navbar categories)
    const filteredCategories = categories.filter(category => category.navbarCategory);

    console.log(`Returning ${filteredCategories.length} active categories for public request`);
    console.log('Categories returned:', filteredCategories.map(cat => ({ 
      name: cat.name, 
      slug: cat.slug,
      navbarCategory: (cat.navbarCategory as any)?.name 
    })));

    return NextResponse.json({ 
      success: true, 
      data: filteredCategories 
    });
  } catch (error) {
    console.error('Error fetching public categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
