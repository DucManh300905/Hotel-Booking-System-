const mongoose = require("mongoose");
 
const VOUCHER_TIERS = [
  { points: 50,  discount: 100000, label: "Giảm 100.000 VND" },
  { points: 100, discount: 250000, label: "Giảm 250.000 VND" },
  { points: 200, discount: 600000, label: "Giảm 600.000 VND" },
];
 
const voucherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", required: true,
    },
    code: {
      type: String, required: true, unique: true, // unique đã tạo index rồi
    },
    pointsUsed: {
      type: Number, required: true,
    },
    discountAmount: {
      type: Number, required: true,
    },
    status: {
      type: String,
      enum: ["active", "used", "expired"],
      default: "active",
    },
    expiresAt: {
      type: Date, required: true,
    },
    usedInBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking", default: null,
    },
  },
  { timestamps: true }
);
 
// Chỉ giữ index cần thiết — bỏ index({ code: 1 }) vì unique đã tạo rồi
voucherSchema.index({ userId: 1, status: 1 });
 
module.exports = mongoose.model("Voucher", voucherSchema);
module.exports.VOUCHER_TIERS = VOUCHER_TIERS;