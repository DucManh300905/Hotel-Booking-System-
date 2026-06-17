const express = require("express");
const router  = express.Router();
 
const authController = require("../controllers/auth.controller");
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth.validator");
const validate       = require("../middleware/validate.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const { authLimiter } = require("../middleware/rateLimiter");
 
// Đăng ký — authLimiter tránh spam tạo tài khoản
router.post("/register", authLimiter, registerValidator, validate, authController.register);
 
// Xác thực email — GET chỉ check, POST mới verify
router.get("/verify-email",  authController.checkVerifyEmail);
router.post("/verify-email", authController.verifyEmail);
 
// Đăng nhập — authLimiter tránh brute force password
router.post("/login", authLimiter, loginValidator, validate, authController.login);
 
// Đăng xuất
router.post("/logout", authMiddleware, authController.logout);
 
// Quên mật khẩu — authLimiter tránh spam gửi email
router.post("/forgot-password", authLimiter, forgotPasswordValidator, validate, authController.forgotPassword);
 
// Đặt lại mật khẩu
router.post("/reset-password", resetPasswordValidator, validate, authController.resetPassword);
 
module.exports = router;
 