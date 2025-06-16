const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const { sendResetPasswordEmail } = require('../services/emailService');
const config = require('../config/config');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: '7d' }); 
};

// Traditional Login
exports.login = async (req, res) => {
    try {
        console.log('🔍 Login attempt:', req.body.email);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email, isActive: true });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                loginType: user.loginType
            }
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Traditional Register
exports.register = async (req, res) => {
    try {
        console.log('🔍 Register attempt:', req.body.email);
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const user = new User({
            name,
            email,
            password,
            loginType: 'traditional'
        });

        await user.save();
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                loginType: user.loginType
            }
        });
    } catch (error) {
        console.error('❌ Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Google OAuth Login
exports.googleAuth = async (req, res) => {
    try {
        console.log('🔍 Google auth request received');
        const { token } = req.body;

        if (!token) {
            console.log('❌ No token provided');
            return res.status(400).json({ message: 'Google token is required' });
        }

        console.log('🔍 Verifying token with Google...');
        
        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        console.log('✅ Token verified successfully');
        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Check if user exists with Google ID
        let user = await User.findOne({ googleId });

        if (!user) {
            // Check if user exists with email
            user = await User.findOne({ email });
            
            if (user) {
                // Link Google account to existing user
                user.googleId = googleId;
                user.picture = picture || user.picture;
                user.loginType = 'google';
                await user.save();
                console.log('🔗 Linked Google account to existing user');
            } else {
                // Create new user
                user = new User({
                    name,
                    email,
                    googleId,
                    picture,
                    loginType: 'google'
                });
                await user.save();
                console.log('👤 Created new Google user');
            }
        }

        const authToken = generateToken(user._id);

        res.status(200).json({
            message: 'Google authentication successful',
            token: authToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                loginType: user.loginType
            }
        });

        console.log('✅ Google auth successful for:', user.email);

    } catch (error) {
        console.error('❌ Google auth error:', error);
        res.status(500).json({ message: 'Google authentication failed' });
    }
};

// Get current user
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                loginType: user.loginType
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Logout
exports.logout = async (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};

exports.forgotPassword = async (req, res) => {
    try {
        console.log('🔍 Forgot password request for:', req.body.email);
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email, isActive: true });
        if (!user) {
            // Don't reveal if user exists or not for security
            return res.status(200).json({ 
                message: 'If an account with that email exists, a reset link has been sent.' 
            });
        }

        // Don't send reset email for Google users
        if (user.loginType === 'google') {
            return res.status(400).json({ 
                message: 'Google users cannot reset password. Please sign in with Google.' 
            });
        }

        // Generate reset token
        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        // Send reset email
        const emailResult = await sendResetPasswordEmail(email, resetToken, user.name);
        
        if (!emailResult.success) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save({ validateBeforeSave: false });
            
            return res.status(500).json({ 
                message: 'Failed to send reset email. Please try again.' 
            });
        }

        console.log('✅ Password reset email sent to:', email);
        res.status(200).json({ 
            message: 'Password reset link sent to your email address.' 
        });
    } catch (error) {
        console.error('❌ Forgot password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        console.log('🔍 Reset password request');
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Hash the token to compare with database
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with valid reset token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
            isActive: true
        });

        if (!user) {
            return res.status(400).json({ 
                message: 'Invalid or expired reset token' 
            });
        }

        // Update password and clear reset token fields
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Generate new JWT token
        const authToken = generateToken(user._id);

        console.log('✅ Password reset successful for:', user.email);
        res.status(200).json({
            message: 'Password reset successful',
            token: authToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                loginType: user.loginType
            }
        });
    } catch (error) {
        console.error('❌ Reset password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};