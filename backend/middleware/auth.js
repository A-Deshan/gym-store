import jwt from 'jsonwebtoken';

// Authentication Middleware (for all protected routes)
export const auth = (req, res, next) => {
  const token = req.headers['token'];
  if (!token) return res.json({ success: false, message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Attach user ID to request
    next();
  } catch (error) {
    return res.json({ success: false, message: 'Unauthorized' });
  }
};

// Remove adminAuth entirely (no role-based access)