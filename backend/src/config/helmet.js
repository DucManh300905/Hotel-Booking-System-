const helmet = require("helmet");
 
const helmetMiddleware = (req, res, next) => {
  // Bỏ qua helmet cho static files (ảnh uploads)
  if (req.path.startsWith("/uploads")) {
    return next();
  }
 
  // Reset password page cần inline styles
  if (req.path.startsWith("/api/auth/reset-password") && req.method === "GET") {
    return next();
  }
 
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // cho phép load ảnh cross-origin
  })(req, res, next);
};
 
module.exports = helmetMiddleware;
 