import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  googleAuth,
  checkEmail,
  sendLoginOtp,
  verifyLoginOtp,
  forgotPassword,
  verifyResetOtp,
  resetPasswordWithOtp,
  resetPassword,
  findAccount,
  subscribePlan,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/check-email', checkEmail);
router.post('/find-account', findAccount);
router.post('/send-login-otp', sendLoginOtp);
router.post('/verify-login-otp', verifyLoginOtp);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password-otp', resetPasswordWithOtp);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/subscribe', protect, subscribePlan);

export default router;
