const mongoose = require("mongoose");
 
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String, required: true, trim: true, minlength: 3,
    },
    email: {
      type: String, required: true, unique: true, lowercase: true, trim: true,
    },
    password: {
      type: String, required: true,
    },
    role: {
      type: String, enum: ["user", "admin"], default: "user",
    },
    isVerified: {
      type: Boolean, default: false,
    },
    verificationToken: {
      type: String, default: null,
    },
    resetPasswordToken: {
      type: String, default: null,
    },
    resetPasswordExpires: {
      type: Date, default: null,
    },
 
    // Điểm tích lũy — chỉ user đã đăng nhập mới có
    points: {
      type: Number, default: 0, min: 0,
    },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("User", userSchema);
 