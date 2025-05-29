const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

exports.register = async (req, res) => {
    try {
        console.log('🔵 Registration attempt:', req.body); // ADD THIS LINE
        
        const { name, email, password, confirmPassword } = req.body;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            console.log('❌ Missing fields validation failed'); // ADD THIS LINE
            return res.status(400).json({
                message: 'All fields are required!'
            });
        }

        if (password !== confirmPassword) {
            console.log('❌ Password mismatch'); // ADD THIS LINE
            return res.status(400).json({
                message: 'Passwords do not match!'
            });
        }

        if (password.length < 6) {
            console.log('❌ Password too short'); // ADD THIS LINE
            return res.status(400).json({
                message: 'Password must be at least 6 characters!'
            });
        }

        // Check existing user
        console.log('🔍 Checking if user exists with email:', email); // ADD THIS LINE
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('❌ User already exists'); // ADD THIS LINE
            return res.status(400).json({
                message: 'User already exists with this email!'
            });
        }

        // Create user
        console.log('🔄 Creating new user...'); // ADD THIS LINE
        const user = await User.create({
            name,
            email,
            password
        });

        console.log('✅ User created successfully:', user._id); // ADD THIS LINE

        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User registered successfully!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error('💥 Registration Error:', error); // ADD THIS LINE
        res.status(500).json({ message: 'Server Error: ' + error.message }); // IMPROVED ERROR
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required!'
            });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password!'
            });
        }

        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: 'Invalid email or password!'
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const userId = req.user.id;

        if (email) {
            const existingUser = await User.findOne({ 
                email, 
                _id: { $ne: userId } 
            });
            if (existingUser) {
                return res.status(400).json({
                    message: 'Email is already taken!'
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Profile updated successfully!',
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};