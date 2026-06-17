const { body } = require("express-validator");
 
const createBookingValidator = [
  body("roomId")
    .notEmpty().withMessage("roomId không được để trống")
    .isMongoId().withMessage("roomId không hợp lệ"),
 
  body("checkIn")
    .notEmpty().withMessage("Ngày nhận phòng không được để trống")
    .isISO8601().withMessage("Ngày nhận phòng không hợp lệ")
    .custom((value) => {
      const checkIn  = new Date(value);
      const today    = new Date();
      today.setHours(0, 0, 0, 0);
      if (checkIn < today) throw new Error("Ngày nhận phòng không được là ngày trong quá khứ");
      return true;
    }),
 
  body("checkOut")
    .notEmpty().withMessage("Ngày trả phòng không được để trống")
    .isISO8601().withMessage("Ngày trả phòng không hợp lệ")
    .custom((value, { req }) => {
      if (!req.body.checkIn) return true;
      const checkIn  = new Date(req.body.checkIn);
      const checkOut = new Date(value);
      if (checkOut <= checkIn) {
        throw new Error("Ngày trả phòng phải sau ngày nhận phòng");
      }
      return true;
    }),
 
  body("fullName")
    .trim()
    .notEmpty().withMessage("Họ và tên không được để trống")
    .isLength({ min: 2, max: 100 }).withMessage("Họ và tên phải từ 2 đến 100 ký tự"),
 
  body("phoneNumber")
    .trim()
    .notEmpty().withMessage("Số điện thoại không được để trống")
    .matches(/^[0-9]{9,11}$/).withMessage("Số điện thoại không hợp lệ (9–11 chữ số)"),
 
  body("idNumber")
    .trim()
    .notEmpty().withMessage("Số CCCD/CMND không được để trống")
    .matches(/^[0-9]{9,12}$/).withMessage("Số CCCD/CMND không hợp lệ (9–12 chữ số)"),
];
 
module.exports = { createBookingValidator };