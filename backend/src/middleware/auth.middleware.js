const { verifyJwt } = require("../services/token.service");
 
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
 
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Không tìm thấy token xác thực" });
  }
 
  const token = authHeader.split(" ")[1];
 
  try {
    const decoded = verifyJwt(token);
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token đã hết hạn, vui lòng đăng nhập lại" });
    }
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
}
 
module.exports = authMiddleware;