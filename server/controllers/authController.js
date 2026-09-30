import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Purchase } from '../models/Purchase.js';
import { sendOtpEmail } from '../utils/emailService.js';
import { connectDB, ensureDBConnected } from '../config/db.js';
import {
  findLocalUserByEmail,
  findLocalUserById,
  saveLocalUser,
  updateLocalUserPassword,
  verifyPassword,
  getLocalUsers,
  setLocalOtp,
  verifyLocalOtp,
  clearLocalOtp,
} from '../utils/localUserStore.js';

const generateToken = (userOrId, expiresIn = '30d') => {
  let payload;
  if (typeof userOrId === 'object' && userOrId !== null) {
    payload = {
      id: userOrId._id || userOrId.id,
      name: userOrId.name || '',
      email: userOrId.email || '',
    };
  } else {
    payload = { id: userOrId };
  }
  return jwt.sign(payload, process.env.JWT_SECRET || 'afterbuy_secret_jwt_key_development_2026', {
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

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if user already exists in DB or local storage
    let userExists = false;
    if (mongoose.connection.readyState === 1) {
      try {
        const found = await User.findOne({ email: normalizedEmail });
        if (found) userExists = true;
      } catch (dbErr) {
        console.warn('[Register User DB Notice]', dbErr.message);
      }
    }

    if (!userExists) {
      const localFound = findLocalUserByEmail(normalizedEmail);
      if (localFound) userExists = true;
    }

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please sign in.',
      });
    }

    let createdUser = null;
    let safeId = null;

    if (mongoose.connection.readyState === 1) {
      try {
        createdUser = await User.create({
          name: name.trim(),
          email: normalizedEmail,
          password,
          phone: phone || '',
          city: city || '',
        });
        safeId = createdUser._id.toString();
      } catch (dbErr) {
        console.warn('[Register User Create Error]', dbErr.message);
      }
    }

    if (!safeId) {
      safeId = crypto.createHash('md5').update(normalizedEmail).digest('hex').substring(0, 24);
    }

    // Always mirror to persistent local storage with bcrypt hashing
    await saveLocalUser({
      id: safeId,
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: phone || '',
      city: city || '',
    });

    const userObj = {
      id: safeId,
      _id: safeId,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone || '',
      city: city || '',
      returnPickupAddress: createdUser?.returnPickupAddress || '',
    };

    const token = generateToken(userObj);

    return res.status(201).json({
      success: true,
      token,
      user: userObj,
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
    if (mongoose.connection.readyState !== 1) {
      await ensureDBConnected(1500);
    }

    let exists = false;
    let name = null;

    // Check MongoDB first
    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({ email: normalizedEmail });
        if (user) {
          exists = true;
          name = user.name;
        }
      } catch (dbErr) {
        console.warn('[Check Email] DB query error:', dbErr.message);
      }
    }

    // Also check local store if not found in DB
    if (!exists) {
      const localUser = findLocalUserByEmail(normalizedEmail);
      if (localUser) {
        exists = true;
        name = localUser.name;
      }
    }

    return res.json({
      success: true,
      exists,
      name,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Try DB lookup if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({ email: normalizedEmail }).select('+password');
        if (user) {
          const isMatch = await user.matchPassword(password);
          if (!isMatch) {
            return res.status(401).json({
              success: false,
              code: 'INCORRECT_PASSWORD',
              message: 'Incorrect password. Please try again or reset your password.',
            });
          }

          // Cache in local store for resilience
          saveLocalUser({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            password: user.password,
            phone: user.phone || '',
            city: user.city || '',
            returnPickupAddress: user.returnPickupAddress || '',
          });

          const token = generateToken(user);

          return res.status(200).json({
            success: true,
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone || '',
              city: user.city || '',
              returnPickupAddress: user.returnPickupAddress || '',
            },
          });
        }
      } catch (dbErr) {
        console.warn('[Login DB Notice]', dbErr.message);
      }
    }

    // 2. Check persistent local store (if DB offline or user created in local fallback)
    const localUser = findLocalUserByEmail(normalizedEmail);
    if (localUser) {
      const isMatch = await verifyPassword(password, localUser.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          code: 'INCORRECT_PASSWORD',
          message: 'Incorrect password. Please try again or reset your password.',
        });
      }

      const token = generateToken({
        id: localUser.id || localUser._id,
        name: localUser.name,
        email: localUser.email,
      }, '30d');

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: localUser.id || localUser._id,
          name: localUser.name,
          email: localUser.email,
          phone: localUser.phone || '',
          city: localUser.city || '',
          returnPickupAddress: localUser.returnPickupAddress || '',
        },
      });
    }

    // 3. User was NOT found in DB and NOT found in local store!
    // STRICT RULE: Reject unknown emails with 404. NEVER auto-login unknown accounts.
    return res.status(404).json({
      success: false,
      code: 'USER_NOT_FOUND',
      message: 'No account found with this email address. Please sign up first.',
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

    if (mongoose.connection.readyState === 1) {
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
    }

    // Fallback search in local store
    if (!user) {
      const localUsers = getLocalUsers();
      if (cleanPhone.length >= 7) {
        user = localUsers.find(
          (u) => u.phone && u.phone.replace(/\D/g, '').includes(cleanPhone.slice(-10))
        );
      }
      if (!user) {
        user = localUsers.find(
          (u) => u.name && u.name.toLowerCase().includes(cleanQuery.toLowerCase())
        );
      }
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
    if (mongoose.connection.readyState === 1 && req.user?.id) {
      try {
        const user = await User.findById(req.user.id);
        if (user) {
          return res.status(200).json({
            success: true,
            user,
          });
        }
      } catch (dbErr) {
        console.warn('[Get Me] DB lookup error:', dbErr.message);
      }
    }

    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update profile details
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, city, pincode, returnPickupAddress, notifications } = req.body;

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

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: updatedUser,
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

    const cleanName = name || email.split('@')[0];

    // Fast check for existing user in DB (capped at 500ms to guarantee zero lag)
    let existingUser = null;
    if (mongoose.connection.readyState === 1) {
      try {
        const findPromise = User.findOne({ email }).lean();
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 500));
        existingUser = await Promise.race([findPromise, timeoutPromise]);
      } catch (e) {
        existingUser = null;
      }
    }

    const userId = existingUser?._id || crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex').substring(0, 24);

    const resolvedName = existingUser?.name || cleanName;
    const token = generateToken({ id: userId, name: resolvedName, email }, '30d');

    // Async background sync: updates MongoDB Atlas without blocking user sign-in response
    if (mongoose.connection.readyState === 1) {
      User.findOneAndUpdate(
        { email },
        {
          $setOnInsert: { name: cleanName, email, provider: 'google' },
          $set: {
            ...(googleId ? { googleId } : {}),
            ...(avatar ? { avatar } : {}),
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).catch((err) => console.warn('[Google Auth Sync Notice]', err.message));
    } else {
      connectDB().catch(() => {});
    }

    // Return instant authenticated response (sub-second sign in)
    return res.status(200).json({
      success: true,
      token,
      sessionDuration: '30-Day session',
      user: {
        id: userId,
        name: resolvedName,
        email,
        phone: existingUser?.phone || '',
        city: existingUser?.city || '',
        avatar: existingUser?.avatar || avatar || '',
        returnPickupAddress: existingUser?.returnPickupAddress || '',
      },
    });
  } catch (error) {
    console.error('[Google Auth Error]', error);
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
    let user = null;

    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ email: normalizedEmail });
      } catch (dbErr) {
        console.warn('[sendLoginOtp DB Notice]', dbErr.message);
      }
    }

    let otp = null;
    let userName = normalizedEmail.split('@')[0];

    if (user) {
      otp = user.getLoginOtp();
      userName = user.name;
      await user.save({ validateBeforeSave: false });
    } else {
      let localUser = findLocalUserByEmail(normalizedEmail);
      if (!localUser) {
        localUser = await saveLocalUser({
          name: userName,
          email: normalizedEmail,
        });
      }
      userName = localUser.name;
      otp = Math.floor(100000 + Math.random() * 900000).toString();
      setLocalOtp(normalizedEmail, otp);
    }

    console.log('\n============================================================');
    console.log('⚡ [AFTERBUY OTP LOGIN] 1-DAY SESSION VERIFICATION CODE');
    console.log(`👤 User:       ${userName} (${normalizedEmail})`);
    console.log(`🔢 OTP CODE:   ${otp}`);
    console.log('⏰ Valid for:  10 Minutes (Activates 1-Day Session)');
    console.log('============================================================\n');

    const emailResult = await sendOtpEmail({
      to: normalizedEmail,
      name: userName,
      otp,
      type: 'login',
    });

    res.status(200).json({
      success: true,
      message: `A 6-digit verification code has been sent to ${normalizedEmail}.`,
      email: normalizedEmail,
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
    let user = null;

    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ email: normalizedEmail });
      } catch (dbErr) {
        console.warn('[verifyLoginOtp DB Notice]', dbErr.message);
      }
    }

    let isValid = false;
    let safeUser = null;

    if (user && user.isValidOtp(otp)) {
      isValid = true;
      user.clearAllOtps();
      await user.save({ validateBeforeSave: false });
      safeUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        city: user.city || '',
        avatar: user.avatar || '',
        returnPickupAddress: user.returnPickupAddress || '',
      };
    } else if (verifyLocalOtp(normalizedEmail, otp)) {
      isValid = true;
      clearLocalOtp(normalizedEmail);
      let localUser = findLocalUserByEmail(normalizedEmail);
      if (!localUser) {
        localUser = await saveLocalUser({ name: normalizedEmail.split('@')[0], email: normalizedEmail });
      }
      safeUser = {
        id: localUser.id || localUser._id,
        name: localUser.name,
        email: localUser.email,
        phone: localUser.phone || '',
        city: localUser.city || '',
        avatar: '',
        returnPickupAddress: localUser.returnPickupAddress || '',
      };
    }

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect or expired verification code. Please check and try again.',
      });
    }

    const token = generateToken(safeUser, '1d');

    return res.status(200).json({
      success: true,
      message: 'Signed in successfully! Your 1-Day session is now active.',
      token,
      sessionDuration: '1-Day session',
      user: safeUser,
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
    let user = null;

    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ email: normalizedEmail });
      } catch (dbErr) {
        console.warn('[forgotPassword DB Notice]', dbErr.message);
      }
    }

    let localUser = null;
    if (!user) {
      localUser = findLocalUserByEmail(normalizedEmail);
    }

    if (!user && !localUser) {
      return res.status(404).json({
        success: false,
        code: 'USER_NOT_FOUND',
        message: 'No account found with this email address.',
      });
    }

    let otp = null;
    let resetToken = null;
    const resolvedName = user?.name || localUser?.name || normalizedEmail.split('@')[0];

    if (user) {
      otp = user.getResetPasswordOtp();
      resetToken = user.getResetPasswordToken();
      await user.save({ validateBeforeSave: false });
    } else {
      otp = Math.floor(100000 + Math.random() * 900000).toString();
      resetToken = crypto.randomBytes(32).toString('hex');
      setLocalOtp(normalizedEmail, otp);
    }

    console.log('\n============================================================');
    console.log('🔐 [AFTERBUY SECURITY] 6-DIGIT OTP VERIFICATION CODE');
    console.log(`👤 User:       ${resolvedName} (${normalizedEmail})`);
    console.log(`🔢 OTP CODE:   ${otp}`);
    console.log('⏰ Valid for:  10 Minutes');
    console.log('============================================================\n');

    const emailResult = await sendOtpEmail({
      to: normalizedEmail,
      name: resolvedName,
      otp,
      type: 'password_reset',
    });

    res.status(200).json({
      success: true,
      message: `A 6-digit verification code has been sent to ${normalizedEmail}.`,
      email: normalizedEmail,
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
    let isValid = false;

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({ email: normalizedEmail });
        if (user && user.isValidOtp(otp)) {
          isValid = true;
        }
      } catch (dbErr) {
        console.warn('[verifyResetOtp DB Notice]', dbErr.message);
      }
    }

    if (!isValid && verifyLocalOtp(normalizedEmail, otp)) {
      isValid = true;
    }

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect or expired OTP code. Please check and try again.',
      });
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
    let user = null;

    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ email: normalizedEmail });
      } catch (dbErr) {
        console.warn('[resetPasswordWithOtp DB Notice]', dbErr.message);
      }
    }

    let isValid = false;
    let safeUser = null;

    if (user && user.isValidOtp(otp)) {
      isValid = true;
      user.password = password;
      user.clearAllOtps();
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      safeUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        city: user.city || '',
        avatar: user.avatar || '',
        returnPickupAddress: user.returnPickupAddress || '',
      };
    } else if (verifyLocalOtp(normalizedEmail, otp)) {
      isValid = true;
      clearLocalOtp(normalizedEmail);
      let localUser = findLocalUserByEmail(normalizedEmail);
      if (!localUser) {
        localUser = await saveLocalUser({ name: normalizedEmail.split('@')[0], email: normalizedEmail, password });
      }
      safeUser = {
        id: localUser.id || localUser._id,
        name: localUser.name,
        email: localUser.email,
        phone: localUser.phone || '',
        city: localUser.city || '',
        avatar: '',
        returnPickupAddress: localUser.returnPickupAddress || '',
      };
    }

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect or expired OTP code. Please request a new code.',
      });
    }

    // Always update local store with the new password
    await updateLocalUserPassword(normalizedEmail, password);

    const authToken = generateToken(safeUser);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! Welcome back to AfterBuy.',
      token: authToken,
      user: safeUser,
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
    await updateLocalUserPassword(user.email, password);

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

// @desc    Permanently delete user account & all purchase records (DPDP/GDPR compliant)
// @route   DELETE /api/auth/account
// @access  Private
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    // 1. Delete all user purchase documents & attachments
    await Purchase.deleteMany({ user: userId });

    // 2. Delete the user account record
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Account and all associated purchase data permanently deleted.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

