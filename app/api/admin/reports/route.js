import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import Admin from '../../../../models/Admin';
import Report from '../../../../models/Report';

// Verify admin token
async function verifyAdminToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    await connectDB();
    const admin = await Admin.findById(decoded.adminId).select('-password');
    
    return admin;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// GET - Fetch all reports for admin
export async function GET(request) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const issueType = searchParams.get('issueType');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const skip = (page - 1) * limit;

    // Build query filter
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    
    if (issueType && issueType !== 'all') {
      query.issueType = issueType;
    }

    // Fetch reports with pagination
    const reports = await Report.find(query)
      .populate('assignedTo', 'name employeeId email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalReports = await Report.countDocuments(query);

    // Get summary statistics
    const stats = {
      total: await Report.countDocuments(),
      pending: await Report.countDocuments({ status: 'pending' }),
      inProgress: await Report.countDocuments({ status: 'in-progress' }),
      resolved: await Report.countDocuments({ status: 'resolved' }),
      highPriority: await Report.countDocuments({ priority: 'high' })
    };

    return NextResponse.json({
      success: true,
      reports,
      stats,
      pagination: {
        current: page,
        total: Math.ceil(totalReports / limit),
        count: totalReports,
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching admin reports:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch reports' 
      },
      { status: 500 }
    );
  }
}

// POST - Create a new report (admin can create reports on behalf of citizens)
export async function POST(request) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const {
      reporterName,
      reporterContact,
      location,
      issueType,
      description,
      priority = 'medium',
      coordinates
    } = body;

    // Validate required fields
    if (!reporterName || !reporterContact || !location || !issueType || !description) {
      return NextResponse.json(
        {
          success: false,
          message: 'Reporter name, contact, location, issue type, and description are required'
        },
        { status: 400 }
      );
    }

    // Generate tracking number
    const trackingNumber = `WQ${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create new report
    const newReport = new Report({
      trackingNumber,
      reporterName,
      reporterContact,
      location,
      issueType,
      description,
      priority,
      coordinates: coordinates || null,
      status: 'pending',
      submissionDate: new Date(),
      createdBy: admin._id // Admin created this report
    });

    const savedReport = await newReport.save();

    return NextResponse.json({
      success: true,
      message: 'Report created successfully',
      report: savedReport,
      trackingNumber
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating admin report:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create report'
      },
      { status: 500 }
    );
  }
}