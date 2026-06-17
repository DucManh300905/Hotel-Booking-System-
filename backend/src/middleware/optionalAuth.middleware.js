const { verifyJwt } = require("../services/token.service");
 
/**
 * Middleware không bắt buộc đăng nhập.
 * Nếu có token hợp lệ → gắn req.user
 * Nếu không có token hoặc token sai → req.user = null, vẫn cho đi tiếp
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }
 
  const token = authHeader.split(" ")[1];
  try {
    req.user = verifyJwt(token);
  } catch {
    req.user = null; // token sai → vẫn cho đi tiếp
  }
  next();
}
 
module.exports = optionalAuth;