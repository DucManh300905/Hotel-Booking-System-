const errorMiddleware = (err, req, res, next) => {
  // Luôn log đầy đủ để debug
  console.error("=== ERROR ===");
  console.error("Message:", err.message);
  console.error("Stack:", err.stack);
  console.error("=============");
 
  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages[0], errors: messages });
  }
 
  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `${field} đã tồn tại` });
  }
 
  // Mongoose CastError
  if (err.name === "CastError") {
    return res.status(400).json({ message: "ID không hợp lệ" });
  }
 
  const status  = err.status || 500;
  const message = status === 500 ? "Lỗi server, vui lòng thử lại sau" : err.message;
 
  res.setHeader("Content-Type", "application/json");
  res.status(status).json({ message });
};
 
module.exports = errorMiddleware;
 