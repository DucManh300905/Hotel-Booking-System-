const mongoose = require("mongoose");
 
const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", default: null,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room", required: true,
    },
    guestInfoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GuestInfo", required: true,
    },
    checkIn:  { type: Date, required: true },
    checkOut: { type: Date, required: true },
 
    totalPrice:     { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0 },
    finalPrice:     { type: Number, required: true },
    depositAmount:  { type: Number, required: true },
 
    voucherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher", default: null,
    },
 
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "deposit_paid", "fully_paid", "failed", "refunded"],
      default: "pending",
    },
    pointsAwarded: { type: Number, default: 0 },
  },
  { timestamps: true }
);
 
bookingSchema.index({ roomId: 1, status: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ userId: 1, createdAt: -1 });
 
module.exports = mongoose.model("Booking", bookingSchema);