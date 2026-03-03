import pool from '../config/database.js';

// =============================================
// NOTIFICATION MANAGEMENT
// =============================================

// GET /api/notifications - Get user's notifications
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;
    const { sent, limit = 50, offset = 0 } = req.query;
    
    // If admin requests sent notifications, show broadcast history
    if (sent === 'true' && (userRole === 'admin' || userRole === 'staff')) {
      const [broadcasts] = await pool.query(
        `SELECT DISTINCT n.notification_id, n.notification_type, n.title, n.message, 
                n.related_id, n.created_at,
                COUNT(DISTINCT n2.user_id) as sent_count,
                CASE 
                  WHEN n.notification_type IN ('offer', 'system') THEN 'all'
                  ELSE 'customers'
                END as target
         FROM notifications n
         LEFT JOIN notifications n2 ON n.title = n2.title AND n.message = n2.message 
              AND n.created_at = n2.created_at
         WHERE n.notification_type IN ('order', 'appointment', 'offer', 'loyalty', 'system')
         GROUP BY n.notification_id, n.notification_type, n.title, n.message, n.related_id, n.created_at
         ORDER BY n.created_at DESC
         LIMIT ? OFFSET ?`,
        [parseInt(limit), parseInt(offset)]
      );

      return res.json({
        success: true,
        data: broadcasts
      });
    }

    // Regular user notifications
    const [notifications] = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

// GET /api/notifications/unread - Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [result] = await pool.query(
      `SELECT COUNT(*) as count FROM notifications 
       WHERE user_id = ? AND is_read = FALSE`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        count: result[0].count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count',
      error: error.message
    });
  }
};

// PUT /api/notifications/:id/read - Mark as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    await pool.query(
      `UPDATE notifications SET is_read = TRUE, read_at = NOW()
       WHERE notification_id = ? AND user_id = ?`,
      [id, userId]
    );

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
};

// PUT /api/notifications/read-all - Mark all as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    await pool.query(
      `UPDATE notifications SET is_read = TRUE, read_at = NOW()
       WHERE user_id = ? AND is_read = FALSE`,
      [userId]
    );

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
};

// DELETE /api/notifications/:id - Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    await pool.query(
      `DELETE FROM notifications WHERE notification_id = ? AND user_id = ?`,
      [id, userId]
    );

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    });
  }
};

// POST /api/notifications/broadcast - Send broadcast notification (Admin)
export const broadcastNotification = async (req, res) => {
  try {
    const { target, notificationType, title, message, relatedId } = req.body;

    if (!target || !notificationType || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Target, notification type, title, and message are required'
      });
    }

    const validTargets = ['all', 'customers', 'doctors', 'specific'];
    const validTypes = ['order', 'appointment', 'pre_booking', 'offer', 'loyalty', 'reminder', 'system'];

    if (!validTargets.includes(target)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid target audience'
      });
    }

    if (!validTypes.includes(notificationType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification type'
      });
    }

    // Get target users
    let userQuery = `SELECT user_id FROM users WHERE is_active = TRUE`;
    
    if (target === 'customers') {
      userQuery += ` AND role = 'customer'`;
    } else if (target === 'doctors') {
      userQuery += ` AND role = 'doctor'`;
    }
    // 'all' gets all users

    const [users] = await pool.query(userQuery);

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No users found for the selected target'
      });
    }

    // Insert notifications for each user
    const insertPromises = users.map(user => 
      pool.query(
        `INSERT INTO notifications (user_id, notification_type, title, message, related_id)
         VALUES (?, ?, ?, ?, ?)`,
        [user.user_id, notificationType, title, message, relatedId || null]
      )
    );

    await Promise.all(insertPromises);

    // Log action
    await pool.query(
      `INSERT INTO audit_logs (user_id, action_type, entity_type, description)
       VALUES (?, 'BROADCAST', 'notification', ?)`,
      [req.user.userId, `Sent broadcast to ${users.length} ${target} users: ${title}`]
    );

    res.status(201).json({
      success: true,
      message: `Notification sent to ${users.length} users`,
      data: { sent_count: users.length }
    });
  } catch (error) {
    console.error('Broadcast notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending broadcast notification',
      error: error.message
    });
  }
};

// POST /api/notifications - Create single notification (Internal use)
export const createNotification = async (userId, type, title, message, relatedId = null) => {
  try {
    await pool.query(
      `INSERT INTO notifications (user_id, notification_type, title, message, related_id)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, type, title, message, relatedId]
    );
    return true;
  } catch (error) {
    console.error('Create notification error:', error);
    return false;
  }
};

