const router = require('express').Router();
const { 
    login, 
    register, 
    googleAuth, 
    getMe, 
    logout, 
    forgotPassword, 
    resetPassword 
} = require('../controllers/auth');
const auth = require('../middleware/auth');

router.post('/auth/login', login);
router.post('/auth/register', register);
router.post('/auth/google-auth', googleAuth);
router.get('/auth/me', auth, getMe);
router.post('/auth/logout', logout);

// Add new reset password routes
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);

module.exports = router;