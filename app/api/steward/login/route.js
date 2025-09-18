import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Steward from '@/models/Steward';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { employeeId, password } = body;

    // Validate required fields
    if (!employeeId || !password) {
      return NextResponse.json({ error: 'Employee ID and password are required' }, { status: 400 });
    }

    // Find steward by employeeId
    const steward = await Steward.findOne({ 
      employeeId: employeeId.toUpperCase(),
      status: 'Active'
    });

    if (!steward) {
      return NextResponse.json({ error: 'Invalid credentials or account inactive' }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, steward.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Update last login
    steward.lastLogin = new Date();
    await steward.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        stewardId: steward._id,
        employeeId: steward.employeeId,
        type: 'steward'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return steward data without password
    const stewardData = {
      _id: steward._id,
      name: steward.name,
      email: steward.email,
      employeeId: steward.employeeId,
      department: steward.department,
      position: steward.position,
      permissions: steward.permissions,
      lastLogin: steward.lastLogin
    };

    return NextResponse.json({
      message: 'Login successful',
      token,
      steward: stewardData
    }, { status: 200 });

  } catch (error) {
    console.error('Steward login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}