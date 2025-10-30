import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import NavbarCategory from '@/app/models/NavbarCategory';

export async function GET() {
  try {
    await connectDB();
    
    // Get all categories with their current status
    const allCategories = await NavbarCategory.find({})
      .select('name slug isActive order createdAt updatedAt')
      .sort({ order: 1, createdAt: 1 });

    console.log('DEBUG: All categories in database:');
    allCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (${cat.slug}) - Active: ${cat.isActive} - Order: ${cat.order}`);
    });

    return NextResponse.json({
      success: true,
      message: 'Debug info logged to console',
      data: allCategories.map(cat => ({
        id: cat._id,
        name: cat.name,
        slug: cat.slug,
        isActive: cat.isActive,
        order: cat.order,
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt
      }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { success: false, error: 'Debug failed' },
      { status: 500 }
    );
  }
}
