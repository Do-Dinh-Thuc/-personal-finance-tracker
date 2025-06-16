const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided, access denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Invalid token, access denied' });
        }

        req.userId = decoded.userId;
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Invalid token, access denied' });
    }
};

module.exports = auth;