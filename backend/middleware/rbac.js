// Role-Based Access Control Middleware

export const requireRole = (allowedRoles) => {
  // Support both array and spread arguments
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRole = req.user.role;
    
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Specific role checkers
export const requireCustomer = requireRole(['customer']);
export const requireDoctor = requireRole(['doctor']);
export const requireStaff = requireRole(['staff', 'admin']);
export const requireAdmin = requireRole(['admin']);

