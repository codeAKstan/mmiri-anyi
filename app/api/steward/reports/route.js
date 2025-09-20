import { connectDB } from '../../../../lib/mongodb';
import Report from '../../../../models/Report';
import { withStewardAuth } from '../../../../middleware/stewardAuth';
import mongoose from 'mongoose';

async function getReports(request) {
  try {
    await connectDB();

    // Get steward ID from middleware
    const stewardId = request.stewardId;
    
    console.log('DEBUG: Steward ID from middleware:', stewardId);
    console.log('DEBUG: Steward ID type:', typeof stewardId);

    // Fetch reports assigned to this steward
    // Convert stewardId to ObjectId for proper comparison
    const assignedReports = await Report.find({ 
      assignedTo: new mongoose.Types.ObjectId(stewardId)
    })
    .sort({ createdAt: -1 }) // Most recent first
    .populate('assignedTo', 'name employeeId')
    .lean();

    console.log('DEBUG: Found assigned reports:', assignedReports.length);
    console.log('DEBUG: Assigned reports:', assignedReports);

    // Also fetch reports created by this steward (if any)
    const createdReports = await Report.find({ 
      createdBy: new mongoose.Types.ObjectId(stewardId)
    })
    .sort({ createdAt: -1 }) // Most recent first
    .populate('createdBy', 'name employeeId')
    .populate('assignedTo', 'name')
    .lean();

    // Combine both arrays, prioritizing assigned reports
    const allReports = [...assignedReports, ...createdReports.filter(report => 
      !assignedReports.some(assigned => assigned._id.toString() === report._id.toString())
    )];

    return new Response(
      JSON.stringify({
        success: true,
        allReports: allReports,
        assignedReports: assignedReports,
        createdReports: createdReports,
        count: allReports.length
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error fetching steward reports:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to fetch reports'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

async function createReport(request) {
  try {
    await connectDB();

    const body = await request.json();
    const stewardId = request.stewardId;
    const steward = request.steward;

    // Validate required fields
    const { 
      location, 
      issueType, 
      description, 
      priority = 'medium',
      coordinates 
    } = body;

    if (!location || !issueType || !description) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Location, issue type, and description are required'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create new report
    const newReport = new Report({
      location,
      issueType,
      description,
      priority,
      coordinates: coordinates || null,
      createdBy: stewardId,
      reporterName: steward.name,
      reporterContact: steward.email,
      status: 'pending',
      submissionDate: new Date()
    });

    const savedReport = await newReport.save();

    // Populate the created report
    const populatedReport = await Report.findById(savedReport._id)
      .populate('createdBy', 'name employeeId')
      .lean();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Report submitted successfully',
        report: populatedReport
      }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error creating steward report:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to create report'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Export protected route handlers
export const GET = withStewardAuth(getReports);
export const POST = withStewardAuth(createReport);