const rateLimit = require("express-rate-limit");
 
/* ── Global limiter — áp dụng toàn app
 * Chỉ chặn các request cực kỳ bất thường (DDoS)
 * 500 request / 15 phút / IP — user bình thường không bao giờ chạm
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Quá nhiều request. Vui lòng thử lại sau." },
  skip: (req) => {
    // Bỏ qua rate limit cho static files (ảnh)
    return req.path.startsWith("/uploads");
  },
});
 
/* ── Auth limiter — cho các route đăng nhập / đăng ký
 * Chặt hơn để tránh brute force password
 * 20 request / 15 phút / IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Quá nhiều lần thử. Vui lòng thử lại sau 15 phút." },
});
 
/* ── Lookup limiter — tra cứu booking bằng SĐT
 * Tránh brute force số điện thoại
 * 10 request / 15 phút / IP
 */
const lookupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Quá nhiều yêu cầu tra cứu. Vui lòng thử lại sau 15 phút." },
});
 
module.exports = { globalLimiter, authLimiter, lookupLimiter };