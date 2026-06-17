const { validationResult } = require("express-validator");
 
/**
 * Middleware dùng sau các validator arrays.
 * Nếu có lỗi → trả 400 kèm danh sách lỗi.
 * Nếu không → next().
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg, // lỗi đầu tiên làm message chính
      errors:  errors.array(),        // toàn bộ lỗi cho client xử lý form
    });
  }
  next();
}
 
module.exports = validate;