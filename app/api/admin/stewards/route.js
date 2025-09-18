import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Steward from '@/models/Steward';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Helper function to generate random password
function generatePassword(length = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// Helper function to send email
async function sendStewardCredentials(stewardData, password) {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@mmiri-anyi.com',
    to: stewardData.email,
    subject: 'Welcome to Mmiri Anyi - Your Steward Account Details',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to Mmiri Anyi</h2>
        <p>Dear ${stewardData.name},</p>
        <p>Your steward account has been successfully created. Below are your login credentials:</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Account Details</h3>
          <p><strong>Employee ID:</strong> ${stewardData.employeeId}</p>
          <p><strong>Email:</strong> ${stewardData.email}</p>
          <p><strong>Temporary Password:</strong> ${password}</p>
          <p><strong>Department:</strong> ${stewardData.department}</p>
          <p><strong>Position:</strong> ${stewardData.position}</p>
        </div>
        
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
        </div>
        
        <p>You can access the system at: <a href="http://localhost:3000/steward/login">Steward Portal</a></p>
        
        <p>If you have any questions, please contact your administrator.</p>
        
        <p>Best regards,<br>Mmiri Anyi Administration Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
}

// Verify admin token
async function verifyAdminToken(request) {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin-session');
    
    if (!sessionCookie) {
      return null;
    }

    await connectDB();
    const admin = await Admin.findById(sessionCookie.value);
    return admin;
  } catch (error) {
    return null;
  }
}

// GET - Fetch all stewards
export async function GET(request) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    if (department && department !== 'all') {
      query.department = department;
    }
    if (status && status !== 'all') {
      query.status = status;
    }

    const stewards = await Steward.find(query)
      .select('-password')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Steward.countDocuments(query);

    return NextResponse.json({
      stewards,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total
      }
    });

  } catch (error) {
    console.error('Error fetching stewards:', error);
    return NextResponse.json({ error: 'Failed to fetch stewards' }, { status: 500 });
  }
}

// POST - Create new steward
export async function POST(request) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const { name, email, phone, address, employeeId, department, position, dateHired } = body;

    // Validate required fields
    if (!name || !email || !phone || !address || !department || !position) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if steward already exists
    const existingSteward = await Steward.findOne({ email });
    if (existingSteward) {
      return NextResponse.json({ error: 'Steward with this email already exists' }, { status: 400 });
    }

    // Check if employeeId already exists (if provided)
    if (employeeId) {
      const existingEmployeeId = await Steward.findOne({ employeeId });
      if (existingEmployeeId) {
        return NextResponse.json({ error: 'Employee ID already exists' }, { status: 400 });
      }
    }

    // Generate password and hash it
    const tempPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Create steward
    const steward = new Steward({
      name,
      email,
      phone,
      address,
      employeeId, // Include employeeId (will be auto-generated if not provided)
      department,
      position,
      dateHired: dateHired || new Date(),
      password: hashedPassword,
      createdBy: admin._id
    });

    await steward.save();

    // Send email with credentials
    const emailResult = await sendStewardCredentials(steward, tempPassword);
    
    // Return steward data without password
    const stewardData = await Steward.findById(steward._id)
      .select('-password')
      .populate('createdBy', 'name email');

    return NextResponse.json({
      message: 'Steward created successfully',
      steward: stewardData,
      emailSent: emailResult.success,
      emailError: emailResult.error || null
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating steward:', error);
    return NextResponse.json({ error: 'Failed to create steward' }, { status: 500 });
  }
}

// PUT - Update steward
export async function PUT(request) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Steward ID is required' }, { status: 400 });
    }

    // Remove password from update data if present
    delete updateData.password;
    delete updateData.createdBy;

    const steward = await Steward.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password').populate('createdBy', 'name email');

    if (!steward) {
      return NextResponse.json({ error: 'Steward not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Steward updated successfully',
      steward
    });

  } catch (error) {
    console.error('Error updating steward:', error);
    return NextResponse.json({ error: 'Failed to update steward' }, { status: 500 });
  }
}

// DELETE - Remove steward
export async function DELETE(request) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Steward ID is required' }, { status: 400 });
    }

    const steward = await Steward.findByIdAndDelete(id);

    if (!steward) {
      return NextResponse.json({ error: 'Steward not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Steward removed successfully'
    });

  } catch (error) {
    console.error('Error removing steward:', error);
    return NextResponse.json({ error: 'Failed to remove steward' }, { status: 500 });
  }
}