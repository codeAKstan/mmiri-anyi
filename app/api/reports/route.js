import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import connectDB from '../../../lib/mongodb';
import Report from '../../../models/Report';
import nodemailer from 'nodemailer';

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Parse form data
    const formData = await request.formData();
    
    const reportData = {
      category: formData.get('category') || 'water',
      issueType: formData.get('issueType'),
      location: formData.get('location'),
      description: formData.get('description'),
      severity: formData.get('severity'),
      name: formData.get('reporterName'),
      phone: formData.get('phoneNumber'),
      email: formData.get('email'),
      ward: formData.get('ward') || '',
      landmark: formData.get('landmark') || ''
    };

    // Validate required fields
    const requiredFields = ['issueType', 'location', 'description', 'severity', 'reporterName', 'phoneNumber', 'email'];
    for (const field of requiredFields) {
      const value = formData.get(field);
      if (!value || value.trim() === '') {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Handle image upload if provided
    let imageUrl = null;
    const imageFile = formData.get('image');
    
    if (imageFile && imageFile.size > 0) {
      try {
        // Upload to Vercel Blob
        const blob = await put(
          `reports/${Date.now()}-${imageFile.name}`,
          imageFile,
          {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN
          }
        );
        imageUrl = blob.url;
      } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }

    // Create new report
    const newReport = new Report({
      ...reportData,
      imageUrl
    });

    await newReport.save();

    // Send confirmation email
    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Communifi</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Issue Report Confirmation</p>
          </div>
          
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1e40af; margin-top: 0;">Thank you for your report!</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h3 style="margin: 0 0 10px 0; color: #1e40af;">Tracking Number</h3>
              <p style="font-size: 24px; font-weight: bold; color: #059669; margin: 0;">${newReport.trackingNumber}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">Report Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Category:</td>
                  <td style="padding: 8px 0; color: #6b7280; text-transform: capitalize;">${reportData.category}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Issue Type:</td>
                  <td style="padding: 8px 0; color: #6b7280;">${reportData.issueType}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Location:</td>
                  <td style="padding: 8px 0; color: #6b7280;">${reportData.location}</td>
                </tr>
                ${reportData.ward ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Ward/Zone:</td><td style="padding: 8px 0; color: #6b7280;">${reportData.ward}</td></tr>` : ''}
                ${reportData.landmark ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Landmark:</td><td style="padding: 8px 0; color: #6b7280;">${reportData.landmark}</td></tr>` : ''}
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Severity:</td>
                  <td style="padding: 8px 0; color: #6b7280;">${reportData.severity}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Status:</td>
                  <td style="padding: 8px 0; color: #6b7280;">Pending Review</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;">
                <strong>What happens next?</strong><br>
                Our team will review your report within 24 hours. You'll receive updates via email as we work to resolve the issue.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #6b7280;">Need immediate assistance?</p>
              <p style="color: #1e40af; font-weight: bold;">📞 +234 813 1944 801</p>
              <p style="color: #1e40af; font-weight: bold;">✉️ help@communifi.com</p>
          </div>
        </div>
        
        <div style="background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 0;">© 2024 Communifi - Community Driven Smart Water Monitoring System</p>
        </div>
      </div>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: reportData.email,
        subject: `Issue Report Confirmation - ${newReport.trackingNumber}`,
        html: emailHtml
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully',
      trackingNumber: newReport.trackingNumber,
      reportId: newReport._id
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('tracking');
    
    if (trackingNumber) {
      // Get specific report by tracking number
      const report = await Report.findOne({ trackingNumber }).select('-__v');
      
      if (!report) {
        return NextResponse.json(
          { error: 'Report not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ report });
    } else {
      // Get all reports (for admin use)
      const reports = await Report.find({})
        .sort({ createdAt: -1 })
        .select('-__v')
        .limit(50);
      
      return NextResponse.json({ reports });
    }
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}