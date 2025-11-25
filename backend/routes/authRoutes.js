const router = require('express').Router();
const { register, verifyOtp, login, resendOtp } = require('../controllers/authController');
router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/resend-otp', resendOtp); 

module.exports = router;
