import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import logger from '../config/logger.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { username, firstName, lastName, email, password, phone } = req.body;
    logger.info(`Registration attempt for email: ${email}, username: ${username}`);

    // Check if user exists by email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      logger.warn(`Registration failed - Email already exists: ${email}`);
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Check if username exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      logger.warn(`Registration failed - Username already exists: ${username}`);
      return res.status(400).json({
        success: false,
        message: 'Username is already taken'
      });
    }

    // Create user
    const user = await User.create({
      username,
      firstName,
      lastName,
      email,
      password,
      phone
    });
    
    logger.info(`User registered successfully: ${email} (ID: ${user._id})`);

    // Generate verification token (optional)
    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    await user.save();

    // Send response with token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        joinedDate: user.joinedDate
      }
    });
  } catch (error) {
    logger.error('Registration error:', { message: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info(`Login attempt for email: ${email}`);

    // Validate input
    if (!email || !password) {
      logger.warn('Login failed - Missing credentials');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user (include password)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      logger.warn(`Login failed - User not found: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn(`Login failed - Invalid password for: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    logger.info(`User logged in successfully: ${email} (ID: ${user._id})`);

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Send response with token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        joinedDate: user.joinedDate
      }
    });
  } catch (error) {
    logger.error('Login error:', { message: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('favorites')
      .select('-password');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email (configure nodemailer)
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const message = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 30 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Password Reset Request',
        html: message
      });

      res.status(200).json({
        success: true,
        message: 'Password reset email sent'
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};
