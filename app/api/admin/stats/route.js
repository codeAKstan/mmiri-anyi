import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '../../../../lib/mongodb';
import Admin from '../../../../models/Admin';
import Report from '../../../../models/Report';

export async function GET() {
  try {
    // Verify admin session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin-session');

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Verify admin exists
    const admin = await Admin.findById(sessionCookie.value);
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Get current date for filtering
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get statistics
    const totalReports = await Report.countDocuments();
    const activeIssues = await Report.countDocuments({ status: { $in: ['pending', 'in_progress'] } });
    const resolvedThisWeek = await Report.countDocuments({ 
      status: 'resolved',
      updatedAt: { $gte: startOfWeek }
    });
    const highRiskZones = await Report.countDocuments({ priority: 'high' });

    // Get reports by status for pie chart
    const reportsByStatus = await Report.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent reports
    const recentReports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('reportId taskName assignedTo date location status priority');

    // Calculate average response time (mock calculation)
    const avgResponseTime = '2h 45m'; // This would be calculated based on actual data

    const stats = {
      totalReports,
      activeIssues,
      resolvedThisWeek,
      highRiskZones,
      avgResponseTime,
      reportsByStatus: reportsByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentReports
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}