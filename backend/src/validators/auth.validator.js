const { body } = require("express-validator");
 
const registerValidator = [
  body("username")
    .trim()
    .notEmpty().withMessage("Tên tài khoản không được để trống")
    .isLength({ min: 3, max: 30 }).withMessage("Tên tài khoản phải từ 3 đến 30 ký tự")
    .escape(),
 
  body("email")
    .notEmpty().withMessage("Email không được để trống")
    .isEmail().withMessage("Email không hợp lệ")
    .normalizeEmail(),
 
  body("password")
    .notEmpty().withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6 }).withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
];
 
const loginValidator = [
  body("email")
    .notEmpty().withMessage("Email không được để trống")
    .isEmail().withMessage("Email không hợp lệ")
    .normalizeEmail(),
 
  body("password")
    .notEmpty().withMessage("Mật khẩu không được để trống"),
];
 
const forgotPasswordValidator = [
  body("email")
    .notEmpty().withMessage("Email không được để trống")
    .isEmail().withMessage("Email không hợp lệ")
    .normalizeEmail(),
];
 
const resetPasswordValidator = [
  body("password")
    .notEmpty().withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6 }).withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
 
  body("confirm")
    .notEmpty().withMessage("Vui lòng xác nhận mật khẩu")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Mật khẩu xác nhận không khớp");
      }
      return true;
    }),
];
 
module.exports = {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
};