import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/app/models/Contact';
import NavbarCategory from '@/app/models/NavbarCategory';
import Dashboard from '@/app/models/Dashboard';
import { checkAdminAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('Dashboard stats request received');
    
    // Debug: Log authentication headers
    const authHeader = request.headers.get('Authorization');
    const cookieHeader = request.cookies.get('admin-token');
    console.log('Auth header:', authHeader ? 'Bearer token present' : 'No Bearer token');
    console.log('Cookie token:', cookieHeader ? 'Cookie present' : 'No cookie');
    
    // Check admin authentication using JWT
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      console.log('Authentication failed - no valid JWT token');
      return NextResponse.json({ 
        success: false, 
        error: 'Admin authentication required' 
      }, { status: 401 });
    }

    console.log('Authentication passed - valid admin JWT token');
    await connectDB();
    
    // Get contacts statistics
    const totalContacts = await Contact.countDocuments();
    const newContacts = await Contact.countDocuments({ status: 'new' });
    const repliedContacts = await Contact.countDocuments({ status: 'replied' });
    const inProgressContacts = await Contact.countDocuments({ status: 'in_progress' });
    const closedContacts = await Contact.countDocuments({ status: 'closed' });
    const unreadContacts = await Contact.countDocuments({ isRead: false });
    const highPriorityContacts = await Contact.countDocuments({ priority: 'high' });
    
    // Get contacts by service type
    const contactsByService = await Contact.aggregate([
      {
        $group: {
          _id: '$service',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get contacts created in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentContacts = await Contact.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });

    // Get contacts trend for last 7 days
    const contactsTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      
      const count = await Contact.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      });
      
      contactsTrend.push({
        date: startOfDay.toLocaleDateString(),
        count
      });
    }

    // Get navbar categories statistics
    const totalNavbarCategories = await NavbarCategory.countDocuments();
    const navbarCategoriesWithSubcategories = await NavbarCategory.aggregate([
      {
        $project: {
          name: 1,
          subcategoriesCount: { $size: { $ifNull: ['$subcategories', []] } }
        }
      }
    ]);

    // Calculate total subcategories
    const totalSubcategories = navbarCategoriesWithSubcategories.reduce((sum, cat) => 
      sum + cat.subcategoriesCount, 0
    );

    // Get products statistics (if Product model exists)
    let totalProducts = 0;
    let productsByCategory = [];
    let productsTrend = [];
    
    try {
      // Try to import Product model dynamically
      const Product = (await import('@/app/models/Product')).default;
      
      totalProducts = await Product.countDocuments();
      
      // Get products by category
      productsByCategory = await Product.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      // Get products trend for last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));
        
        const count = await Product.countDocuments({
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        
        productsTrend.push({
          date: startOfDay.toLocaleDateString(),
          count
        });
      }
    } catch (error) {
      console.log('Product model not found or error accessing products:', error instanceof Error ? error.message : 'Unknown error');
    }

    // Calculate growth percentages (mock data for now, you can implement based on previous periods)
    const stats = {
      overview: {
        totalContacts,
        totalProducts,
        totalNavbarCategories,
        totalSubcategories,
        newContacts,
        unreadContacts,
        highPriorityContacts,
        recentContacts
      },
      contacts: {
        total: totalContacts,
        new: newContacts,
        replied: repliedContacts,
        inProgress: inProgressContacts,
        closed: closedContacts,
        unread: unreadContacts,
        highPriority: highPriorityContacts,
        recent: recentContacts,
        byService: contactsByService,
        trend: contactsTrend
      },
      products: {
        total: totalProducts,
        byCategory: productsByCategory,
        trend: productsTrend
      },
      categories: {
        navbarCategories: totalNavbarCategories,
        subcategories: totalSubcategories,
        breakdown: navbarCategoriesWithSubcategories
      },
      growth: {
        contacts: recentContacts > 0 ? Math.round((recentContacts / totalContacts) * 100) : 0,
        products: totalProducts > 0 ? 15 : 0, // Mock data
        categories: totalNavbarCategories > 0 ? 8 : 0, // Mock data
        revenue: 12 // Mock data
      }
    };

    console.log('Dashboard stats compiled:', {
      contacts: totalContacts,
      products: totalProducts,
      categories: totalNavbarCategories,
      subcategories: totalSubcategories
    });

    // Save dashboard snapshot to database
    try {
      // Calculate service distribution with percentages
      const serviceDistribution = contactsByService.map(service => ({
        serviceName: service._id || 'Unknown',
        count: service.count,
        percentage: totalContacts > 0 ? Math.round((service.count / totalContacts) * 100) : 0
      }));

      // Calculate product category distribution with percentages
      const productCategoryDistribution = productsByCategory.map(category => ({
        category: category._id || 'Uncategorized',
        count: category.count,
        percentage: totalProducts > 0 ? Math.round((category.count / totalProducts) * 100) : 0
      }));

      // Prepare dashboard data for saving
      const dashboardData = {
        totalContacts,
        totalProducts,
        totalCategories: totalNavbarCategories,
        totalSubcategories,
        newContacts,
        repliedContacts,
        inProgressContacts,
        closedContacts,
        unreadContacts,
        highPriorityContacts,
        contactsGrowth: recentContacts > 0 ? Math.round((recentContacts / totalContacts) * 100) : 0,
        productsGrowth: totalProducts > 0 ? 15 : 0, // You can calculate real growth here
        categoriesGrowth: totalNavbarCategories > 0 ? 8 : 0, // You can calculate real growth here
        serviceDistribution,
        contactsTrend: contactsTrend.map(trend => ({
          date: new Date(trend.date),
          count: trend.count
        })),
        productsTrend: productsTrend.map(trend => ({
          date: new Date(trend.date),
          count: trend.count
        })),
        productsByCategory: productCategoryDistribution,
        categoriesBreakdown: navbarCategoriesWithSubcategories,
        totalViews: 0, // You can implement view tracking
        activeUsers: 1, // You can implement user tracking
        revenue: {
          monthly: 89200, // Mock data - implement real revenue tracking
          growth: 12,
          currency: 'USD'
        },
        createdBy: 'admin-system'
      };

      // Save to database (create snapshot)
      await (Dashboard as any).createSnapshot(dashboardData, 'real-time');
      console.log('Dashboard snapshot saved to database');
    } catch (dbError) {
      console.error('Error saving dashboard snapshot:', dbError);
      // Continue without failing the request
    }

    return NextResponse.json({ 
      success: true, 
      data: stats
    });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
