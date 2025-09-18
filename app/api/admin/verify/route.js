import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '../../../../lib/mongodb';
import Admin from '../../../../models/Admin';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin-session');

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find admin by session ID
    const admin = await Admin.findById(sessionCookie.value).select('-password');
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      admin: admin,
      authenticated: true
    });

  } catch (error) {
    console.error('Admin verification error:', error);
    return NextResponse.json(
      { error: 'Session verification failed' },
      { status: 500 }
    );
  }
}