import jwt from 'jsonwebtoken';
import { connectDB } from '../lib/mongodb';
import Admin from '../models/Admin';

export async function adminAuthMiddleware(request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        error: 'No token provided',
        status: 401
      };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return {
        success: false,
        error: 'Invalid or expired token',
        status: 401
      };
    }

    // Connect to database
    await connectDB();

    // Find admin by ID from token
    const admin = await Admin.findById(decoded.adminId).select('-password');
    
    if (!admin) {
      return {
        success: false,
        error: 'Admin not found',
        status: 401
      };
    }

    // Return success with admin data
    return {
      success: true,
      admin: admin,
      adminId: admin._id
    };

  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return {
      success: false,
      error: 'Authentication failed',
      status: 500
    };
  }
}

// Helper function to create protected API route handler
export function withAdminAuth(handler) {
  return async function protectedHandler(request, context) {
    const authResult = await adminAuthMiddleware(request);
    
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: authResult.error 
        }),
        { 
          status: authResult.status || 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Add admin data to request context
    request.admin = authResult.admin;
    request.adminId = authResult.adminId;

    // Call the original handler
    return handler(request, context);
  };
}

// Middleware for checking specific admin permissions
export function checkAdminPermission(permission) {
  return function permissionMiddleware(admin) {
    // For now, all admins have all permissions
    // This can be extended later for role-based permissions
    return { success: true };
  };
}

// Helper function to validate admin permissions in routes
export function requireAdminPermission(permission) {
  return function(handler) {
    return withAdminAuth(async function(request, context) {
      const permissionCheck = checkAdminPermission(permission)(request.admin);
      
      if (!permissionCheck.success) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: permissionCheck.error 
          }),
          { 
            status: permissionCheck.status,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      return handler(request, context);
    });
  };
}