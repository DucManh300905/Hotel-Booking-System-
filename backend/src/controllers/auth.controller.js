const authService = require("../services/auth.service");
 
/* ── POST /api/auth/register ── */
async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const result = await authService.register({ username, email, password });
    res.status(201).json(result);
  } catch (err) { next(err); }
}
 
/* ── GET /api/auth/verify-email?token=<rawToken>
   Chỉ kiểm tra token hợp lệ — KHÔNG xóa token
   Gmail bot click link này nhưng không làm hỏng token
── */
async function checkVerifyEmail(req, res, next) {
  try {
    await authService.checkVerifyToken(req.query.token);
    res.json({ valid: true });
  } catch (err) { next(err); }
}
 
/* ── POST /api/auth/verify-email
   Thực sự verify — xóa token, kích hoạt tài khoản
   Chỉ chạy khi user chủ động nhấn nút xác nhận
── */
async function verifyEmail(req, res, next) {
  try {
    await authService.verifyEmail(req.body.token);
    res.json({ message: "Xác thực thành công" });
  } catch (err) { next(err); }
}
 
/* ── POST /api/auth/login ── */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.json(result);
  } catch (err) { next(err); }
}
 
/* ── POST /api/auth/logout ── */
function logout(req, res) {
  res.json({ message: "Đăng xuất thành công" });
}
 
/* ── POST /api/auth/forgot-password ── */
async function forgotPassword(req, res, next) {
  try {
    await authService.forgotPassword(req.body.email);
    res.json({ message: "Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu." });
  } catch (err) { next(err); }
}
 
/* ── POST /api/auth/reset-password ── */
async function resetPassword(req, res, next) {
  try {
    const { token }    = req.query;
    const { password } = req.body;
    await authService.resetPassword(token, password);
    res.json({ message: "Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại." });
  } catch (err) { next(err); }
}
 
module.exports = { register, checkVerifyEmail, verifyEmail, login, logout, forgotPassword, resetPassword };