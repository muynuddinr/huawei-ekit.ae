import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { NavbarCategory } from '@/app/models';

// GET - Fetch active navbar categories (public endpoint)
export async function GET(request: NextRequest) {
  try {
    console.log('Public navbar categories request received');
    await connectDB();
    
    // Public endpoint - only return active categories with limited fields
    const categories = await NavbarCategory.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .select('name slug description order');

    console.log(`Returning ${categories.length} active navbar categories for public request`);
    console.log('Categories returned:', categories.map(cat => ({ 
      name: cat.name, 
      slug: cat.slug 
    })));

    return NextResponse.json({ 
      success: true, 
      data: categories 
    });
  } catch (error) {
    console.error('Error fetching public navbar categories:', error);
    return NextResponse.json({ error: 'Failed to fetch navbar categories' }, { status: 500 });
  }
}
