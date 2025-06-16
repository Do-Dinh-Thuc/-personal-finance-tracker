const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId;
        },
        minLength: 6
    },
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    picture: {
        type: String,
        default: ''
    },
    loginType: {
        type: String,
        enum: ['traditional', 'google'],
        default: 'traditional'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // Add reset password fields
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}, {timestamps: true});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
UserSchema.methods.comparePassword = async function(password) {
    if (!this.password) return false;
    return await bcrypt.compare(password, this.password);
};

// Generate reset password token
UserSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    
    return resetToken;
};

module.exports = mongoose.model('User', UserSchema);