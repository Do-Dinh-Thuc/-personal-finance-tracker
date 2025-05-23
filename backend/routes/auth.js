const router = require('express').Router();
const { register, login, getMe, updateProfile } = require('../controllers/auth');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);

module.exports = router;