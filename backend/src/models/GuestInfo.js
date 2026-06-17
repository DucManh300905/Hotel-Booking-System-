const mongoose = require("mongoose");
 
// Toàn bộ field lưu dạng "<iv>:<authTag>:<ciphertext>" (hex)
// sau khi mã hóa AES-256-GCM bởi encryption.service.js
const guestInfoSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true, // encrypted
    },
 
    phoneNumber: {
      type: String,
      required: true, // encrypted
    },
 
    // Số CCCD / CMND
    idNumber: {
      type: String,
      required: true, // encrypted
    },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("GuestInfo", guestInfoSchema);