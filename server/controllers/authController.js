import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { sendOtpEmail } from '../utils/emailService.js';

const generateToken = (id, expiresIn = '30d') => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'afterbuy_secret_jwt_key_development_2026', {
    expiresIn,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, city } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      city: city || '',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        returnPickupAddress: user.returnPickupAddress,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check if an email exists for unified auth flow
// @route   POST /api/auth/check-email
export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    res.json({
      success: true,
      exists: !!user,
      name: user ? user.name : null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user & get token
// @desc    Login user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        code: 'USER_NOT_FOUND',
        message: `No account found with this email address`,
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        code: 'INCORRECT_PASSWORD',
        message: 'Incorrect password. Please try again or reset your password.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        returnPickupAddress: user.returnPickupAddress,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Find account by phone number or name (if email forgotten)
// @route   POST /api/auth/find-account
export const findAccount = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter a phone number or name' });
    }

    const cleanQuery = query.trim();
    const cleanPhone = cleanQuery.replace(/\D/g, '');
    let user = null;

    if (cleanPhone.length >= 7) {
      user = await User.findOne({
        phone: { $regex: cleanPhone.slice(-10), $options: 'i' },
      });
    }

    if (!user) {
      user = await User.findOne({
        name: { $regex: cleanQuery, $options: 'i' },
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this information. You can create a new account anytime.',
      });
    }

    // Mask email for privacy (e.g. "kushan53@gmail.com" -> "k***3@gmail.com")
    const parts = user.email.split('@');
    const local = parts[0];
    const domain = parts[1] || '';
    const maskedLocal =
      local.length <= 2
        ? local.charAt(0) + '***'
        : local.charAt(0) + '***' + local.charAt(local.length - 1);
    const maskedEmail = `${maskedLocal}@${domain}`;

    res.status(200).json({
      success: true,
      found: true,
      maskedEmail,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update profile details
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, city, pincode, returnPickupAddress, notifications, plan, planBillingCycle } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (city !== undefined) user.city = city;
    if (pincode !== undefined) user.pincode = pincode;
    if (returnPickupAddress !== undefined) user.returnPickupAddress = returnPickupAddress;
    if (notifications) user.notifications = { ...user.notifications, ...notifications };
    if (plan && ['free', 'pro'].includes(plan)) user.plan = plan;
    if (planBillingCycle && ['monthly', 'annual', 'lifetime'].includes(planBillingCycle)) {
      user.planBillingCycle = planBillingCycle;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Subscribe / Change plan (Upgrade or Downgrade)
// @route   POST /api/auth/subscribe
export const subscribePlan = async (req, res) => {
  try {
    const { plan = 'pro', billingCycle = 'monthly', paymentMethod = 'UPI' } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const now = new Date();
    user.plan = plan;
    user.planBillingCycle = billingCycle;
    user.planStartedAt = now;

    if (plan === 'pro') {
      const expires = new Date();
      if (billingCycle === 'annual') {
        expires.setFullYear(expires.getFullYear() + 1);
      } else {
        expires.setMonth(expires.getMonth() + 1);
      }
      user.planExpiresAt = expires;
    } else {
      user.planExpiresAt = null;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: plan === 'pro' ? 'Congratulations! AfterBuy Pro activated.' : 'Plan changed to Free Tier.',
      user: updatedUser,
      transaction: {
        id: `TXN_${Date.now()}`,
        plan,
        billingCycle,
        paymentMethod,
        date: now.toISOString(),
        amount: plan === 'pro' ? (billingCycle === 'annual' ? 1299 : 149) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Google 1-Click Sign-in / Sign-up
// @route   POST /api/auth/google
export const googleAuth = async (req, res) => {
  try {
    const { name, email, googleId, avatar } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Google authentication failed: Email is required' });
    }

    let user = await User.findOne({ email });

    if (user) {
      // User exists, update Google profile attributes if needed
      if (!user.googleId && googleId) user.googleId = googleId;
      if (!user.avatar && avatar) user.avatar = avatar;
      await user.save();
    } else {
      // Create new user via Google
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        googleId: googleId || '',
        avatar: avatar || '',
        provider: 'google',
      });
    }

    const token = generateToken(user._id, '30d');

    res.status(200).json({
      success: true,
      token,
      sessionDuration: '30-Day session',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        city: user.city || '',
        avatar: user.avatar || '',
        returnPickupAddress: user.returnPickupAddress || '',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send 6-digit OTP for 1-Day passwordless login
// @route   POST /api/auth/send-login-otp
export const sendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Create new user account for OTP login
      user = new User({
        name: normalizedEmail.split('@')[0],
        email: normalizedEmail,
        provider: 'email_otp',
      });
    }

    const otp = user.getLoginOtp();
    await user.save({ validateBeforeSave: false });

    console.log('\n============================================================');
    console.log('⚡ [AFTERBUY OTP LOGIN] 1-DAY SESSION VERIFICATION CODE');
    console.log(`👤 User:       ${user.name} (${user.email})`);
    console.log(`🔢 OTP CODE:   ${otp}`);
    console.log('⏰ Valid for:  10 Minutes (Activates 1-Day Session)');
    console.log('============================================================\n');

    const emailResult = await sendOtpEmail({
      to: user.email,
      name: user.name,
      otp,
    });

    res.status(200).json({
      success: true,
      message: `A 6-digit verification code has been sent to ${user.email}.`,
      email: user.email,
      emailSent: emailResult.sent,
      sessionDuration: '1-Day session',
      otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    });
  } catch (error) {
    console.error('sendLoginOtp error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify 6-digit OTP and activate 1-Day session
// @route   POST /api/auth/verify-login-otp
export const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide email and 6-digit verification code' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found for this email address' });
    }

    if (!user.isValidOtp(otp)) {
      return res.status(400).json({ success: false, message: 'Incorrect or expired verification code. Please check and try again.' });
    }

    // Clear all OTPs once verified
    user.clearAllOtps();
    await user.save({ validateBeforeSave: false });

    // Generate 1-Day session JWT
    const token = generateToken(user._id, '1d');

    res.status(200).json({
      success: true,
      message: 'Signed in successfully! Your 1-Day session is now active.',
      token,
      sessionDuration: '1-Day session',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        city: user.city || '',
        avatar: user.avatar || '',
        returnPickupAddress: user.returnPickupAddress || '',
      },
    });
  } catch (error) {
    console.error('verifyLoginOtp error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password - generate 6-digit OTP & email reset
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email address' });
    }

    // Generate 6-digit OTP (10-min validity) and reset token
    const otp = user.getResetPasswordOtp();
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Output OTP clearly to server terminal for instant verification
    console.log('\n============================================================');
    console.log('🔐 [AFTERBUY SECURITY] 6-DIGIT OTP VERIFICATION CODE');
    console.log(`👤 User:       ${user.name} (${user.email})`);
    console.log(`🔢 OTP CODE:   ${otp}`);
    console.log('⏰ Valid for:  10 Minutes');
    console.log('============================================================\n');

    // Trigger Realtime Email Dispatch via Nodemailer
    const emailResult = await sendOtpEmail({
      to: user.email,
      name: user.name,
      otp,
    });

    res.status(200).json({
      success: true,
      message: `A 6-digit verification code has been sent to ${user.email}.`,
      email: user.email,
      emailSent: emailResult.sent,
      otp, // included for seamless development & offline testing
      token: resetToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify 6-digit OTP
// @route   POST /api/auth/verify-reset-otp
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide email and 6-digit OTP code' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    if (!user.isValidOtp(otp)) {
      return res.status(400).json({ success: false, message: 'Incorrect or expired OTP code. Please check and try again.' });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully. You can now set your new password.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password using verified OTP
// @route   POST /api/auth/reset-password-otp
export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email, OTP code, and new password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    if (!user.isValidOtp(otp)) {
      return res.status(400).json({ success: false, message: 'Incorrect or expired OTP code. Please request a new code.' });
    }

    // Set new password (bcrypt pre-save hook will hash it automatically)
    user.password = password;
    user.clearAllOtps();
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Auto-authenticate user with fresh JWT token
    const authToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! Welcome back to AfterBuy.',
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        city: user.city || '',
        avatar: user.avatar || '',
        returnPickupAddress: user.returnPickupAddress || '',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password with token (URL fallback)
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Password reset token is missing' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    // Hash the token provided in the URL/request to compare with the hashed token in DB
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset link. Please request a new one.',
      });
    }

    // Set new password (pre-save hook will hash it with bcrypt)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpire = undefined;

    await user.save();

    // Auto-authenticate user with fresh JWT token
    const authToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! Logging you in...',
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        city: user.city || '',
        avatar: user.avatar || '',
        returnPickupAddress: user.returnPickupAddress || '',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

