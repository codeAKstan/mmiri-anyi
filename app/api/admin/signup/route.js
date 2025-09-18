import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '../../../../lib/mongodb';
import Admin from '../../../../models/Admin';

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if admin already exists
    const existingAdminCount = await Admin.countDocuments();
    if (existingAdminCount > 0) {
      return NextResponse.json(
        { error: 'Admin account already exists. Only one admin is allowed.' },
        { status: 403 }
      );
    }

    // Check if email is already taken
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin
    const admin = new Admin({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.trim()
    });

    await admin.save();

    // Return success response without password
    const { password: _, ...adminData } = admin.toObject();
    
    return NextResponse.json({
      message: 'Admin account created successfully',
      admin: adminData
    }, { status: 201 });

  } catch (error) {
    console.error('Admin signup error:', error);
    
    if (error.code === 'ADMIN_EXISTS') {
      return NextResponse.json(
        { error: 'Admin account already exists. Only one admin is allowed.' },
        { status: 403 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create admin account' },
      { status: 500 }
    );
  }
}