const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  // 1️⃣ Check if Authorization header exists and starts with Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2️⃣ Extract token
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'No token found in Authorization header' });
      }

      // 3️⃣ Verify token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

      // 4️⃣ Find the user attached to the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found for this token' });
      }

      // 5️⃣ Continue to the next middleware/route
      next();
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  } else {
    console.warn('No Authorization header found');
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
