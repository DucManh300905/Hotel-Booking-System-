const mongoose = require("mongoose");
 
const pointLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", required: true,
    },
 
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking", default: null,
    },
 
    action: {
      type: String,
      enum: [
        "earned",   // cộng điểm khi booking được xác nhận
        "redeemed", // trừ điểm khi đổi voucher
        "expired",  // điểm hết hạn
        "adjusted", // admin điều chỉnh thủ công
      ],
      required: true,
    },
 
    points: {
      type: Number, required: true, // dương = cộng, âm = trừ
    },
 
    // Số dư sau khi action
    balanceAfter: {
      type: Number, required: true,
    },
 
    note: { type: String, default: "" },
  },
  { timestamps: true }
);
 
pointLogSchema.index({ userId: 1, createdAt: -1 });
 
module.exports = mongoose.model("PointLog", pointLogSchema);
 