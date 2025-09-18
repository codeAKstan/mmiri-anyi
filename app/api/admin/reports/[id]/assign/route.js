import { connectDB } from '../../../../../../lib/mongodb';
import Report from '../../../../../../models/Report';
import Steward from '../../../../../../models/Steward';
import { withAdminAuth } from '../../../../../../middleware/adminAuth';
import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // You can change this to your email service
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS // Your email password or app password
    }
  });
};

// Send notification email to citizen
const sendCitizenNotification = async (report, steward) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: report.email,
      subject: 'Your Water Quality Report Has Been Assigned - Mmiri Anyi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
            <h1>Mmiri Anyi - Report Update</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f9fafb;">
            <h2>Good News! Your Report Has Been Assigned</h2>
            
            <p>Dear ${report.name},</p>
            
            <p>We're pleased to inform you that your water quality report has been assigned to one of our qualified stewards for investigation and resolution.</p>
            
            <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>Report Details:</h3>
              <p><strong>Issue Type:</strong> ${report.issueType}</p>
              <p><strong>Location:</strong> ${report.location}</p>
              <p><strong>Status:</strong> <span style="color: #2563eb; font-weight: bold;">In Progress</span></p>
              <p><strong>Submitted:</strong> ${new Date(report.submissionDate).toLocaleDateString()}</p>
            </div>
            
            <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>Assigned Steward:</h3>
              <p><strong>Name:</strong> ${steward.name}</p>
              <p><strong>Department:</strong> ${steward.department}</p>
              <p><strong>Employee ID:</strong> ${steward.employeeId}</p>
            </div>
            
            <p>Our steward will begin working on your report immediately. You can expect updates as progress is made on resolving the issue.</p>
            
            <p>Thank you for helping us maintain clean water for our community!</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                This is an automated message from Mmiri Anyi Water Quality Management System.
                <br>If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Citizen notification sent successfully');
  } catch (error) {
    console.error('Error sending citizen notification:', error);
  }
};

// Send notification email to steward
const sendStewardNotification = async (report, steward) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: steward.email,
      subject: 'New Report Assignment - Mmiri Anyi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #059669; color: white; padding: 20px; text-align: center;">
            <h1>Mmiri Anyi - New Assignment</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f9fafb;">
            <h2>You Have Been Assigned a New Report</h2>
            
            <p>Dear ${steward.name},</p>
            
            <p>A new water quality report has been assigned to you for investigation and resolution. Please review the details below and take appropriate action.</p>
            
            <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>Report Details:</h3>
              <p><strong>Issue Type:</strong> ${report.issueType}</p>
              <p><strong>Location:</strong> ${report.location}</p>
              <p><strong>Priority:</strong> <span style="color: ${report.priority === 'high' ? '#dc2626' : report.priority === 'medium' ? '#d97706' : '#059669'}; font-weight: bold; text-transform: capitalize;">${report.priority}</span></p>
              <p><strong>Description:</strong> ${report.description}</p>
              <p><strong>Submitted:</strong> ${new Date(report.submissionDate).toLocaleDateString()}</p>
            </div>
            
            <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>Reporter Information:</h3>
              <p><strong>Name:</strong> ${report.name}</p>
              <p><strong>Contact:</strong> ${report.phone}</p>
            </div>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <p><strong>Action Required:</strong></p>
              <p>Please log into your steward dashboard to view full report details and begin the investigation process. The citizen has been notified that you are now handling their report.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/steward/dashboard" 
                 style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Access Steward Dashboard
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                This is an automated message from Mmiri Anyi Water Quality Management System.
                <br>If you have any questions about this assignment, please contact the admin team.
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Steward notification sent successfully');
  } catch (error) {
    console.error('Error sending steward notification:', error);
  }
};

async function assignReport(request, { params }) {
  try {
    await connectDB();

    const awaitedParams = await params;
    const reportId = awaitedParams.id;
    const body = await request.json();
    const { stewardId } = body;

    // Validate input
    if (!stewardId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Steward ID is required'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Find the report
    const report = await Report.findById(reportId);
    if (!report) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Report not found'
        }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if report is already assigned
    if (report.status !== 'pending') {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Report is not in pending status and cannot be assigned'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Find the steward
    const steward = await Steward.findById(stewardId);
    if (!steward) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Steward not found'
        }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if steward is active
    if (steward.status !== 'Active') {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Steward is not active and cannot be assigned reports'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Update the report
    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      {
        assignedTo: stewardId,
        status: 'in-progress',
        assignedDate: new Date()
      },
      { new: true }
    ).populate('assignedTo', 'name employeeId department email');

    // Send email notifications (don't wait for them to complete)
    Promise.all([
      sendCitizenNotification(report, steward),
      sendStewardNotification(report, steward)
    ]).catch(error => {
      console.error('Error sending notifications:', error);
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Report assigned successfully',
        report: updatedReport,
        assignedSteward: {
          _id: steward._id,
          name: steward.name,
          employeeId: steward.employeeId,
          department: steward.department
        }
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error assigning report:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to assign report'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Export protected route handler
export const POST = withAdminAuth(assignReport);