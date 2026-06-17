const crypto = require("crypto");
const jwt    = require("jsonwebtoken");
 
/* ── JWT ── */
/**
 * Tạo JWT chứa { id, role }.*/
function signJwt(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
}
 
/**
 * Verify JWT → decoded payload.
 * Throw JsonWebTokenError / TokenExpiredError nếu không hợp lệ.
 */
function verifyJwt(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
 
/* ── One-time tokens (email verify / reset password) ──
 *
 * Quy trình bảo mật:
 *   1. Tạo rawToken = 32 random bytes (hex) → gửi qua email dưới dạng URL param
 *   2. Lưu hashToken = SHA-256(rawToken) vào DB
 *   3. Khi user click link: hash lại rawToken → so sánh với hashToken trong DB
 *
 * → Nếu DB bị lộ, kẻ tấn công không dùng được hashToken vì không có rawToken.
 */
 
/**
 * Tạo cặp { rawToken, hashToken }.
 * rawToken  → nhúng vào URL email.
 * hashToken → lưu vào DB.
 */
function generateToken() {
  const rawToken  = crypto.randomBytes(32).toString("hex");
  const hashToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  return { rawToken, hashToken };
}
 
/**
 * Hash một rawToken đã có → để so sánh với giá trị trong DB.
 */
function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}
 
module.exports = { signJwt, verifyJwt, generateToken, hashToken };
 