import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Admin from '../../../../models/Admin';

export async function GET() {
  try {
    await connectDB();
    
    const adminCount = await Admin.countDocuments();
    
    return NextResponse.json({ 
      adminExists: adminCount > 0,
      count: adminCount 
    });
  } catch (error) {
    console.error('Error checking admin existence:', error);
    return NextResponse.json(
      { error: 'Failed to check admin existence' },
      { status: 500 }
    );
  }
}