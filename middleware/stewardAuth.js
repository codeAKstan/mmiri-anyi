import jwt from 'jsonwebtoken';
import { connectDB } from '../lib/mongodb';
import Steward from '../models/Steward';

export async function stewardAuthMiddleware(request) {
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

    // Find steward by ID from token
    const steward = await Steward.findById(decoded.stewardId).select('-password');
    
    if (!steward) {
      return {
        success: false,
        error: 'Steward not found',
        status: 401
      };
    }

    // Check if steward account is active
    if (steward.status !== 'active') {
      return {
        success: false,
        error: 'Account is not active',
        status: 403
      };
    }

    // Return success with steward data
    return {
      success: true,
      steward: steward,
      stewardId: steward._id
    };

  } catch (error) {
    console.error('Steward auth middleware error:', error);
    return {
      success: false,
      error: 'Authentication failed',
      status: 500
    };
  }
}

// Helper function to create protected API route handler
export function withStewardAuth(handler) {
  return async function protectedHandler(request, context) {
    const authResult = await stewardAuthMiddleware(request);
    
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

    // Add steward data to request context
    request.steward = authResult.steward;
    request.stewardId = authResult.stewardId;

    // Call the original handler
    return handler(request, context);
  };
}

// Middleware for checking specific permissions
export function checkStewardPermission(permission) {
  return function permissionMiddleware(steward) {
    if (!steward.permissions || !steward.permissions[permission]) {
      return {
        success: false,
        error: `Insufficient permissions: ${permission} required`,
        status: 403
      };
    }
    
    return { success: true };
  };
}

// Helper function to validate steward permissions in routes
export function requireStewardPermission(permission) {
  return function(handler) {
    return withStewardAuth(async function(request, context) {
      const permissionCheck = checkStewardPermission(permission)(request.steward);
      
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