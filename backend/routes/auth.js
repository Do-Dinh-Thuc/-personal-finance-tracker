const router = require('express').Router();
const { 
    login, 
    register, 
    googleAuth, 
    getMe, 
    logout, 
    forgotPassword, 
    resetPassword,
    // ✅ ADD: New profile management functions
    updateProfile,
    changePassword,
    deleteAccount
} = require('../controllers/auth');
const auth = require('../middleware/auth');

// Existing routes
router.post('/auth/login', login);
router.post('/auth/register', register);
router.post('/auth/google-auth', googleAuth);
router.get('/auth/me', auth, getMe);
router.post('/auth/logout', logout);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);

// ✅ NEW: Profile management routes
router.put('/auth/profile', auth, updateProfile);
router.put('/auth/change-password', auth, changePassword);
router.delete('/auth/delete-account', auth, deleteAccount);

module.exports = router;