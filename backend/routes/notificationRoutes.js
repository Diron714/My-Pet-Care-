import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { verifyAccessToken } from '../config/jwt.js';

const router = express.Router();

// Optional authentication middleware
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyAccessToken(token);
      req.user = decoded;
    }
  } catch (error) {
    // Not authenticated, continue without user
  }
  next();
};

// Get all notifications (optional auth - returns empty if not logged in)
router.get('/', optionalAuth, async (req, res) => {
  try {
    // Return empty notifications for now (can be implemented later)
    res.json({
      success: true,
      data: [],
      message: 'Notifications retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving notifications',
      error: error.message
    });
  }
});

// Get unread notifications (optional auth)
router.get('/unread', optionalAuth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: [],
      message: 'Unread notifications retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving unread notifications',
      error: error.message
    });
  }
});

// Mark notification as read (requires auth)
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
});

// Mark all as read (requires auth)
router.put('/read-all', authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking all notifications as read',
      error: error.message
    });
  }
});

// Delete notification (requires auth)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    });
  }
});

export default router;

