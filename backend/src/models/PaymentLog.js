const mongoose = require("mongoose");
 
const paymentLogSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking", required: true,
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", default: null,
    },
    action: {
      type: String,
      enum: [
        "booking_created",
        "deposit_paid",
        "fully_paid",
        "booking_confirmed",
        "booking_cancelled",
        "refunded",
      ],
      required: true,
    },
    note:   { type: String,  default: "" },
    amount: { type: Number,  default: null },
  },
  { timestamps: true }
);
 
paymentLogSchema.index({ bookingId: 1, createdAt: -1 });
 
module.exports = mongoose.model("PaymentLog", paymentLogSchema);