import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    googleId: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    provider: {
      type: String,
      enum: ['local', 'google', 'email_otp'],
      default: 'local',
    },
    loginOtp: {
      type: String,
      default: null,
    },
    loginOtpExpire: {
      type: Date,
      default: null,
    },
    phone: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    pincode: {
      type: String,
      default: '',
    },
    returnPickupAddress: {
      type: String,
      default: '',
    },
    currency: {
      type: String,
      default: 'INR (₹)',
    },
    plan: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free',
    },
    planBillingCycle: {
      type: String,
      enum: ['monthly', 'annual', 'lifetime'],
      default: 'monthly',
    },
    planStartedAt: {
      type: Date,
      default: null,
    },
    planExpiresAt: {
      type: Date,
      default: null,
    },
    notifications: {
      urgentReturnAlerts: { type: Boolean, default: true },
      overdueRefundAlerts: { type: Boolean, default: true },
      whatsappUpdates: { type: Boolean, default: true },
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpire: {
      type: Date,
      default: null,
    },
    resetPasswordOtp: {
      type: String,
      default: null,
    },
    resetPasswordOtpExpire: {
      type: Date,
      default: null,
    },
    previousOtp: {
      type: String,
      default: null,
    },
    previousOtpExpire: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving (only if password exists and is modified)
userSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password helper
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token (15-min validity)
userSchema.methods.getResetPasswordToken = function () {
  // Generate random 32-byte string
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token using SHA-256 and store in DB
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time to 15 minutes from now
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

// Generate 6-digit OTP for password reset (10-min validity) - strictly latest only
userSchema.methods.getResetPasswordOtp = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expireTime = Date.now() + 10 * 60 * 1000;
  
  // Strictly invalidate any previous code
  this.previousOtp = undefined;
  this.previousOtpExpire = undefined;
  
  this.resetPasswordOtp = otp;
  this.loginOtp = otp; // Keep login and reset OTP in sync
  this.resetPasswordOtpExpire = expireTime;
  this.loginOtpExpire = expireTime;
  return otp;
};

// Generate 6-digit OTP for 1-Day passwordless login (10-min validity) - strictly latest only
userSchema.methods.getLoginOtp = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expireTime = Date.now() + 10 * 60 * 1000;
  
  // Strictly invalidate any previous code
  this.previousOtp = undefined;
  this.previousOtpExpire = undefined;
  
  this.loginOtp = otp;
  this.resetPasswordOtp = otp; // Keep login and reset OTP in sync
  this.loginOtpExpire = expireTime;
  this.resetPasswordOtpExpire = expireTime;
  return otp;
};

// Validate candidate OTP against ONLY the latest active OTP
userSchema.methods.isValidOtp = function (candidateOtp) {
  if (!candidateOtp) return false;
  const clean = candidateOtp.toString().trim();
  const now = Date.now();

  // ONLY accept the single latest active OTP
  if (this.resetPasswordOtp === clean && this.resetPasswordOtpExpire && this.resetPasswordOtpExpire > now) {
    return true;
  }

  if (this.loginOtp === clean && this.loginOtpExpire && this.loginOtpExpire > now) {
    return true;
  }

  return false;
};

// Clear all active OTPs once successfully verified
userSchema.methods.clearAllOtps = function () {
  this.loginOtp = undefined;
  this.loginOtpExpire = undefined;
  this.resetPasswordOtp = undefined;
  this.resetPasswordOtpExpire = undefined;
  this.previousOtp = undefined;
  this.previousOtpExpire = undefined;
};

export const User = mongoose.model('User', userSchema);

