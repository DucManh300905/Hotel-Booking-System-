const { body } = require("express-validator");
 
const createRoomValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Tên phòng không được để trống")
    .isLength({ min: 2, max: 100 }).withMessage("Tên phòng phải từ 2 đến 100 ký tự"),
 
  body("price")
    .notEmpty().withMessage("Giá phòng không được để trống")
    .isNumeric().withMessage("Giá phòng phải là số")
    .custom((value) => {
      if (Number(value) < 0) throw new Error("Giá phòng không được âm");
      return true;
    }),
 
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Mô tả không được vượt quá 500 ký tự"),
];
 
const updateRoomValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty().withMessage("Tên phòng không được để trống")
    .isLength({ min: 2, max: 100 }).withMessage("Tên phòng phải từ 2 đến 100 ký tự"),
 
  body("price")
    .optional()
    .isNumeric().withMessage("Giá phòng phải là số")
    .custom((value) => {
      if (Number(value) < 0) throw new Error("Giá phòng không được âm");
      return true;
    }),
 
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Mô tả không được vượt quá 500 ký tự"),
 
  body("isAvailable")
    .optional()
    .isBoolean().withMessage("isAvailable phải là true hoặc false"),
];
 
module.exports = { createRoomValidator, updateRoomValidator };