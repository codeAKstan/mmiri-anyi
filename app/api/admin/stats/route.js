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
    const activeIssues = await Report.countDocuments({ status: { $in: ['pending', 'in-progress'] } });
    const resolvedThisWeek = await Report.countDocuments({ 
      status: 'resolved',
      updatedAt: { $gte: startOfWeek }
    });
    const highRiskZones = await Report.countDocuments({ severity: 'high' });

    // Get reports by status for pie chart
    const reportsByStatus = await Report.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent reports with proper formatting
    const recentReports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('trackingNumber issueType assignedTo createdAt location status severity name');

    // Format recent reports for dashboard
    const formattedReports = recentReports.map(report => ({
      id: report.trackingNumber,
      taskName: report.issueType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      assignedBy: report.name || 'System',
      assignedTo: report.assignedTo || 'Unassigned',
      date: report.createdAt.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      location: report.location,
      status: report.status,
      severity: report.severity
    }));

    // Calculate average response time (mock calculation for now)
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
      recentReports: formattedReports,
      adminProfile: {
        name: admin.name,
        email: admin.email,
        initials: admin.name.split(' ').map(n => n[0]).join('').toUpperCase()
      }
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