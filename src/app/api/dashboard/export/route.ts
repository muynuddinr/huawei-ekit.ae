import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Dashboard from '@/app/models/Dashboard';

// GET - Export dashboard data
export async function GET(request: NextRequest) {
  try {
    console.log('Dashboard export request received');
    
    // Check admin authentication
    const adminToken = request.cookies.get('admin-token');
    const isAdmin = adminToken?.value === 'admin-authenticated';
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json'; // json or csv
    const type = searchParams.get('type') || 'all';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '100');

    // Build query
    const query: any = {};
    
    if (type !== 'all') {
      query.type = type;
    }

    if (startDate || endDate) {
      query.generatedAt = {};
      if (startDate) {
        query.generatedAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.generatedAt.$lte = new Date(endDate);
      }
    }

    // Get dashboard data
    const dashboards = await Dashboard.find(query)
      .sort({ generatedAt: -1 })
      .limit(limit)
      .select('-__v');

    if (format === 'csv') {
      // Generate CSV
      const csvHeaders = [
        'Generated At',
        'Type',
        'Total Contacts',
        'Total Products',
        'Total Categories',
        'New Contacts',
        'Replied Contacts',
        'Unread Contacts',
        'High Priority Contacts',
        'Contacts Growth %',
        'Products Growth %',
        'Completion Rate %',
        'Avg Response Time (hrs)',
        'Monthly Revenue',
        'Created By'
      ];

      const csvData = dashboards.map(dashboard => [
        new Date(dashboard.generatedAt).toLocaleString(),
        dashboard.type,
        dashboard.totalContacts,
        dashboard.totalProducts,
        dashboard.totalCategories,
        dashboard.newContacts,
        dashboard.repliedContacts,
        dashboard.unreadContacts,
        dashboard.highPriorityContacts,
        dashboard.contactsGrowth,
        dashboard.productsGrowth,
        dashboard.completionRate,
        dashboard.avgResponseTime,
        dashboard.revenue.monthly,
        dashboard.createdBy
      ]);

      const csvContent = [csvHeaders, ...csvData]
        .map(row => row.join(','))
        .join('\n');

      // Return CSV file
      const fileName = `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`;
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${fileName}"`
        }
      });
    } else {
      // Return JSON
      return NextResponse.json({ 
        success: true, 
        data: dashboards,
        exportInfo: {
          totalRecords: dashboards.length,
          exportedAt: new Date(),
          filters: { type, startDate, endDate },
          format: 'json'
        }
      });
    }
    
  } catch (error) {
    console.error('Error exporting dashboard data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export dashboard data' },
      { status: 500 }
    );
  }
}
