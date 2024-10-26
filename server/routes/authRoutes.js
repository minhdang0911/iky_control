const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Đăng ký và đăng nhập
router.post('/register', authController.register);
router.post('/verify-code', authController.verifyCode);

// Route xác thực số điện thoại
// router.post('/verify', authController.verifyPhoneNumber);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/getUser', authController.getUserById);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/request-change-password', authController.requestChangePassword);
router.post('/change-password', authController.changePassword);

module.exports = router;
