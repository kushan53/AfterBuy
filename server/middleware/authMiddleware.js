import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Token missing.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'afterbuy_secret_jwt_key_development_2026');
    
    // If DB is connected, fetch fresh user document
    if (mongoose.connection.readyState === 1) {
      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (dbErr) {
        req.user = null;
      }
    }

    // If user record wasn't fetched but token is cryptographically valid, populate safe session identity
    if (!req.user) {
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        name: decoded.name || '',
        email: decoded.email || '',
      };
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed or expired.',
    });
  }
};
