const bcrypt = require("bcrypt");
 
const User                  = require("../models/User");
const { signJwt, generateToken, hashToken } = require("./token.service");
const { sendVerificationEmail, sendResetPasswordEmail } = require("./email.service");
 
const SALT_ROUNDS          = 10;
const RESET_TOKEN_EXPIRES  = 15 * 60 * 1000; // 15 phút (ms)
 
/* ── Register ── */
 
async function register({ username, email, password }) {
  // Kiểm tra email đã tồn tại
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error("Email đã được sử dụng");
    err.status = 400;
    throw err;
  }
 
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const { rawToken, hashToken: hashedToken } = generateToken();
 
  const user = await User.create({
    username,
    email,
    password:          hashedPassword,
    verificationToken: hashedToken, // lưu hash vào DB
  });
 
  // Gửi email chứa rawToken
  await sendVerificationEmail(email, rawToken);
 
  return { message: "Đăng ký thành công! Hãy kiểm tra email để xác thực tài khoản." };
}
 
/* ── Verify Email ── */
 
async function verifyEmail(rawToken) {
  const hashed = hashToken(rawToken);
 
  const user = await User.findOne({ verificationToken: hashed });
  if (!user) {
    const err = new Error("Link xác thực không hợp lệ hoặc đã được sử dụng");
    err.status = 400;
    throw err;
  }
 
  user.isVerified        = true;
  user.verificationToken = null;
  await user.save();
}
 
/* ── Login ── */
 
async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Email không tồn tại");
    err.status = 400;
    throw err;
  }
 
  if (!user.isVerified) {
    const err = new Error("Vui lòng xác thực email trước khi đăng nhập");
    err.status = 403;
    throw err;
  }
 
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Mật khẩu không đúng");
    err.status = 400;
    throw err;
  }
 
  const token = signJwt({ id: user._id, role: user.role });
  return { token };
}
 
/* ── Forgot Password ── */
 
async function forgotPassword(email) {
  const user = await User.findOne({ email });
 
  // Luôn trả về thành công để tránh email enumeration attack
  if (!user) return;
 
  const { rawToken, hashToken: hashedToken } = generateToken();
 
  user.resetPasswordToken   = hashedToken; // lưu hash vào DB
  user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_EXPIRES);
  await user.save();
 
  await sendResetPasswordEmail(email, rawToken);
}
 
/* ── Reset Password ── */
 
async function resetPassword(rawToken, newPassword) {
  const hashed = hashToken(rawToken);
 
  const user = await User.findOne({
    resetPasswordToken:   hashed,
    resetPasswordExpires: { $gt: Date.now() },
  });
 
  if (!user) {
    const err = new Error("Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn");
    err.status = 400;
    throw err;
  }
 
  user.password             = await bcrypt.hash(newPassword, SALT_ROUNDS);
  user.resetPasswordToken   = null;
  user.resetPasswordExpires = null;
  await user.save();
}
 
module.exports = { register, checkVerifyToken, verifyEmail, login, forgotPassword, resetPassword };
 
/* ── Check Verify Token (không xóa token) ── */
async function checkVerifyToken(rawToken) {
  const hashed = hashToken(rawToken);
  const user   = await User.findOne({ verificationToken: hashed });
  if (!user) {
    const err = new Error("Link xác thực không hợp lệ hoặc đã được sử dụng");
    err.status = 400;
    throw err;
  }
  return true;
}