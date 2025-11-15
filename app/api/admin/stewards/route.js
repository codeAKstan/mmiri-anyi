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
  // Check if email configuration is available
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email configuration missing, skipping email send');
    return { success: false, error: 'Email configuration not available' };
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@communifi.com',
    to: stewardData.email,
    subject: 'Welcome to Communifi - Your Steward Account Details',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to Communifi</h2>
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
        
        <p>You can access the system at: <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://communifi.vercel.app'}/steward/login">Steward Portal</a></p>
        
        <p>If you have any questions, please contact your administrator.</p>
        
        <p>Best regards,<br>Communifi Administration Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', stewardData.email);
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
  const isProduction = process.env.NODE_ENV === 'production';
  const environment = isProduction ? 'PRODUCTION' : 'DEVELOPMENT';
  
  console.log(`[${environment}] Starting steward creation process...`);
  console.log(`[${environment}] Environment details:`, {
    nodeEnv: process.env.NODE_ENV,
    host: request.headers.get('host'),
    userAgent: request.headers.get('user-agent')?.substring(0, 50),
    timestamp: new Date().toISOString()
  });
  
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      console.log(`[${environment}] Unauthorized access attempt`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`[${environment}] Admin verified:`, admin.email);

    try {
      await connectDB();
      console.log(`[${environment}] Database connected successfully`);
    } catch (dbError) {
      console.error(`[${environment}] Database connection failed:`, dbError);
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: process.env.NODE_ENV === 'development' ? dbError.message : 'Internal server error'
      }, { status: 500 });
    }
    
    const body = await request.json();
    const { name, email, phone, address, employeeId, department, position, dateHired } = body;

    console.log(`[${environment}] Raw request body:`, JSON.stringify(body, null, 2));
    console.log(`[${environment}] Request body types:`, {
      name: typeof body.name,
      email: typeof body.email,
      phone: typeof body.phone,
      address: typeof body.address,
      department: typeof body.department,
      position: typeof body.position,
      dateHired: typeof body.dateHired
    });
    console.log(`[${environment}] Extracted values:`, { 
      name, 
      email, 
      phone, 
      address, 
      department, 
      position, 
      dateHired,
      employeeId 
    });

    // Detailed validation with environment-specific logging
    console.log(`[${environment}] Starting validation process...`);
    
    const missingFields = [];
    const fieldLengthErrors = [];
    const validationDetails = {};
    
    // Check required fields (trimmed to handle whitespace)
    const fields = { name, email, phone, address, department, position };
    
    Object.entries(fields).forEach(([fieldName, value]) => {
      const trimmedValue = value ? value.toString().trim() : '';
      validationDetails[fieldName] = {
        original: value,
        trimmed: trimmedValue,
        length: trimmedValue.length,
        isEmpty: trimmedValue.length === 0
      };
      
      if (!value || trimmedValue.length === 0) {
        missingFields.push(fieldName);
      }
    });
    
    console.log(`[${environment}] Field validation details:`, validationDetails);
    
    // Check field lengths (according to model schema)
    const lengthLimits = {
      name: 100,
      email: 100, 
      phone: 20,
      address: 200,
      position: 100
    };
    
    Object.entries(lengthLimits).forEach(([fieldName, limit]) => {
      const value = fields[fieldName];
      if (value && value.toString().trim().length > limit) {
        fieldLengthErrors.push(`${fieldName} (max ${limit} characters, got ${value.toString().trim().length})`);
      }
    });
    
    if (missingFields.length > 0) {
      console.log(`[${environment}] Missing required fields:`, missingFields);
      console.log(`[${environment}] Validation failed - returning 400`);
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}`,
        details: validationDetails
      }, { status: 400 });
    }
    
    if (fieldLengthErrors.length > 0) {
      console.log(`[${environment}] Field length validation errors:`, fieldLengthErrors);
      return NextResponse.json({ 
        error: `Field length errors: ${fieldLengthErrors.join(', ')}` 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = email.trim();
    if (!emailRegex.test(trimmedEmail)) {
      console.log(`[${environment}] Invalid email format:`, { original: email, trimmed: trimmedEmail });
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate department
     const validDepartments = ['Water Quality', 'Distribution', 'Customer Service', 'Maintenance', 'Field Operations'];
     const trimmedDepartment = department.trim();
     if (!validDepartments.includes(trimmedDepartment)) {
       console.log(`[${environment}] Invalid department:`, { 
         original: department, 
         trimmed: trimmedDepartment,
         validOptions: validDepartments 
       });
       return NextResponse.json({ 
         error: `Invalid department. Must be one of: ${validDepartments.join(', ')}` 
       }, { status: 400 });
     }

     // Validate phone (match model regex exactly)
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const trimmedPhone = phone.trim();
      if (!phoneRegex.test(trimmedPhone)) {
        console.log(`[${environment}] Invalid phone format:`, { 
          original: phone, 
          trimmed: trimmedPhone,
          regex: phoneRegex.toString(),
          modelRegex: '/^[\\+]?[1-9][\\d]{0,15}$/'
        });
        return NextResponse.json({ error: 'Invalid phone number format. Must start with 1-9 and contain only digits (optionally with + prefix)' }, { status: 400 });
      }
     
     console.log(`[${environment}] All validation checks passed!`);
     try {
       // Check if steward already exists
       console.log(`[${environment}] Checking for existing steward with email:`, email);
       const existingSteward = await Steward.findOne({ email });
       if (existingSteward) {
         console.log(`[${environment}] Steward already exists with email:`, email);
         return NextResponse.json({ error: 'Steward with this email already exists' }, { status: 400 });
       }

       // Check if employee ID already exists (if provided)
       if (employeeId) {
         console.log(`[${environment}] Checking for existing employee ID:`, employeeId);
         const existingEmployee = await Steward.findOne({ employeeId });
         if (existingEmployee) {
           console.log(`[${environment}] Employee ID already exists:`, employeeId);
           return NextResponse.json({ error: 'Employee ID already exists' }, { status: 400 });
         }
       }
       
     console.log(`[${environment}] No existing conflicts found, proceeding with creation...`);
   } catch (dbCheckError) {
     console.error(`[${environment}] Database check error:`, dbCheckError);
     return NextResponse.json({ 
       error: 'Database error during validation', 
       details: isProduction ? 'Internal server error' : dbCheckError.message 
     }, { status: 500 });
   }

   console.log(`[${environment}] Validation passed, generating password...`);

   // Generate password and hash it
   const tempPassword = generatePassword();
   const hashedPassword = await bcrypt.hash(tempPassword, 12);

   console.log(`[${environment}] Password generated and hashed`);

   // Generate unique employeeId if not provided (fix race condition)
   let finalEmployeeId = employeeId;
   if (!finalEmployeeId) {
     let attempts = 0;
     const maxAttempts = 5;
     
     while (attempts < maxAttempts) {
       try {
         const count = await Steward.countDocuments();
         const candidateId = `STW${String(count + 1 + attempts).padStart(4, '0')}`;
         
         // Check if this ID already exists
         const existingId = await Steward.findOne({ employeeId: candidateId });
         if (!existingId) {
           finalEmployeeId = candidateId;
           break;
         }
         attempts++;
       } catch (countError) {
         console.error(`[${environment}] Error generating employee ID:`, countError);
         attempts++;
       }
     }
     
     if (!finalEmployeeId) {
       // Fallback to timestamp-based ID
       finalEmployeeId = `STW${Date.now().toString().slice(-4)}`;
     }
   }

   console.log(`[${environment}] Final employee ID:`, finalEmployeeId);

   try {
     // Create steward
     const steward = new Steward({
       name,
       email,
       phone,
       address,
       employeeId: finalEmployeeId,
       department,
       position,
       dateHired: dateHired || new Date(),
       password: hashedPassword,
       createdBy: admin._id
     });

     console.log(`[${environment}] Attempting to save steward...`);
     await steward.save();
     console.log(`[${environment}] Steward saved successfully with ID:`, steward._id);

     // Send email with credentials (don't fail the whole operation if email fails)
     let emailResult = { success: false, error: null };
     try {
       console.log(`[${environment}] Attempting to send email...`);
       emailResult = await sendStewardCredentials(steward, tempPassword);
       console.log(`[${environment}] Email result:`, emailResult);
     } catch (emailError) {
       console.error(`[${environment}] Email sending failed:`, emailError);
       emailResult = { success: false, error: emailError.message };
     }
     
     // Return steward data without password
     const stewardData = await Steward.findById(steward._id)
       .select('-password')
       .populate('createdBy', 'name email');

     console.log(`[${environment}] Steward creation completed successfully`);

     return NextResponse.json({
       message: 'Steward created successfully',
       steward: stewardData,
       emailSent: emailResult.success,
       emailError: emailResult.error || null
     }, { status: 201 });

   } catch (dbOperationError) {
     console.error(`[${environment}] Database operation error:`, dbOperationError);
     
     // Handle specific MongoDB errors
     if (dbOperationError.code === 11000) {
       const field = Object.keys(dbOperationError.keyPattern)[0];
       return NextResponse.json({ 
         error: `${field} already exists`,
         details: `A steward with this ${field} already exists in the system`
       }, { status: 400 });
     }
     
     if (dbOperationError.name === 'ValidationError') {
       const validationErrors = Object.values(dbOperationError.errors).map(err => err.message);
       return NextResponse.json({ 
         error: 'Validation failed',
         details: validationErrors
       }, { status: 400 });
     }
     
     return NextResponse.json({ 
       error: 'Database operation failed',
       details: isProduction ? 'Internal server error' : dbOperationError.message
     }, { status: 500 });
   }

 } catch (error) {
   console.error(`[${environment}] Error creating steward:`, error);
   console.error(`[${environment}] Error stack:`, error.stack);
   
   return NextResponse.json({ 
     error: 'Failed to create steward',
     details: isProduction ? 'Internal server error' : error.message
   }, { status: 500 });
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