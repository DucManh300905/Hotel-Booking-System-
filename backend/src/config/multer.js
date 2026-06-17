const multer = require("multer");
const path   = require("path");
const crypto = require("crypto");
 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/rooms");
  },
  filename: (req, file, cb) => {
    const ext      = path.extname(file.originalname).toLowerCase();
    const randName = crypto.randomBytes(16).toString("hex");
    cb(null, `${randName}${ext}`);
  },
});
 
const fileFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".webp"];
  const ext     = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file ảnh: jpg, jpeg, png, webp"), false);
  }
};
 
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
 
module.exports = upload;