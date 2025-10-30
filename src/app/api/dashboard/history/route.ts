import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Dashboard from '@/app/models/Dashboard';

// GET - Retrieve saved dashboard snapshots
export async function GET(request: NextRequest) {
  try {
    console.log('Dashboard history request received');
    
    // Check admin authentication
    const adminToken = request.cookies.get('admin-token');
    const isAdmin = adminToken?.value === 'admin-authenticated';
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'real-time'; // daily, weekly, monthly, real-time
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (type !== 'all') {
      query.type = type;
    }

    // Get dashboard snapshots
    const dashboards = await Dashboard.find(query)
      .sort({ generatedAt: -1 })
      .limit(limit)
      .skip(skip)
      .select('-__v');

    // Get total count for pagination
    const totalCount = await Dashboard.countDocuments(query);

    console.log(`Returning ${dashboards.length} dashboard snapshots`);

    return NextResponse.json({ 
      success: true, 
      data: dashboards,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
        hasMore: skip + dashboards.length < totalCount
      }
    });
    
  } catch (error) {
    console.error('Error fetching dashboard history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard history' },
      { status: 500 }
    );
  }
}

// POST - Create a manual dashboard snapshot
export async function POST(request: NextRequest) {
  try {
    console.log('Manual dashboard snapshot creation requested');
    
    // Check admin authentication
    const adminToken = request.cookies.get('admin-token');
    const isAdmin = adminToken?.value === 'admin-authenticated';
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const { type = 'manual', note } = body;

    // Trigger the stats API to get fresh data and save snapshot
    const statsResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/dashboard/stats`, {
      method: 'GET',
      headers: {
        Cookie: `admin-token=admin-authenticated`
      }
    });

    if (!statsResponse.ok) {
      throw new Error('Failed to fetch current stats');
    }

    const statsData = await statsResponse.json();
    
    if (!statsData.success) {
      throw new Error('Failed to get dashboard statistics');
    }

    console.log('Manual dashboard snapshot created successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Dashboard snapshot created successfully',
      type: type,
      note: note || 'Manual snapshot'
    });
    
  } catch (error) {
    console.error('Error creating dashboard snapshot:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create dashboard snapshot' },
      { status: 500 }
    );
  }
}

// DELETE - Delete old dashboard snapshots
export async function DELETE(request: NextRequest) {
  try {
    console.log('Dashboard cleanup request received');
    
    // Check admin authentication
    const adminToken = request.cookies.get('admin-token');
    const isAdmin = adminToken?.value === 'admin-authenticated';
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const { olderThan = 30, type } = body; // Delete snapshots older than X days

    // Calculate date threshold
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - olderThan);

    // Build delete query
    const deleteQuery: any = {
      generatedAt: { $lt: thresholdDate }
    };

    if (type && type !== 'all') {
      deleteQuery.type = type;
    }

    // Delete old snapshots
    const deleteResult = await Dashboard.deleteMany(deleteQuery);

    console.log(`Deleted ${deleteResult.deletedCount} old dashboard snapshots`);

    return NextResponse.json({ 
      success: true, 
      message: `Deleted ${deleteResult.deletedCount} old dashboard snapshots`,
      deletedCount: deleteResult.deletedCount,
      olderThan: `${olderThan} days`
    });
    
  } catch (error) {
    console.error('Error cleaning up dashboard snapshots:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cleanup dashboard snapshots' },
      { status: 500 }
    );
  }
}
