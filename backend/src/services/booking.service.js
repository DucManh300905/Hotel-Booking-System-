const Booking    = require("../models/Booking");
const Room       = require("../models/Room");
const GuestInfo  = require("../models/GuestInfo");
const PaymentLog = require("../models/PaymentLog");
const Voucher    = require("../models/Voucher");
 
const { encrypt, decryptGuestInfo } = require("./encryption.service");
const { calculateTotalPrice }       = require("../utils/calculatePrice");
const { maskIdNumber }              = require("../utils/maskSensitiveData");
const { awardPoints }               = require("./point.service");
 
function buildQRDescription(bookingId, depositAmount) {
  const shortId   = String(bookingId).slice(-8).toUpperCase();
  const timestamp = Math.floor(Date.now() / 1000);
  return `BOOKING-${shortId}-AMOUNT-${depositAmount}-TS-${timestamp}`;
}
 
async function createBooking(userId, {
  roomId, checkIn, checkOut,
  fullName, phoneNumber, idNumber,
  voucherCode,
}) {
  const room = await Room.findById(roomId);
  if (!room) {
    const err = new Error("Phòng không tồn tại"); err.status = 404; throw err;
  }
  if (!room.isAvailable) {
    const err = new Error("Phòng hiện không còn nhận đặt"); err.status = 400; throw err;
  }
 
  const start = new Date(checkIn);
  const end   = new Date(checkOut);
 
  const conflict = await Booking.findOne({
    roomId, status: { $ne: "cancelled" },
    $or: [{ checkIn: { $lt: end }, checkOut: { $gt: start } }],
  });
  if (conflict) {
    const err = new Error("Phòng đã được đặt trong khoảng thời gian này"); err.status = 400; throw err;
  }
 
  const guestInfo = await GuestInfo.create({
    fullName:    encrypt(fullName),
    phoneNumber: encrypt(phoneNumber),
    idNumber:    encrypt(idNumber),
  });
 
  const totalPrice = calculateTotalPrice(start, end, room.price);
 
  // Giới hạn voucher tối đa 50% tổng giá trị phòng
  const MAX_VOUCHER_RATIO = 0.5;
 
  let discountAmount = 0;
  let voucherId      = null;
  let voucherDoc     = null;
  let voucherCapped  = false;
 
  if (voucherCode && userId) {
    voucherDoc = await Voucher.findOne({
      code:      voucherCode.toUpperCase().trim(),
      userId,
      status:    "active",
      expiresAt: { $gt: new Date() },
    });
    if (!voucherDoc) {
      const err = new Error("Voucher không hợp lệ, đã hết hạn hoặc không thuộc về bạn");
      err.status = 400; throw err;
    }
 
    // Áp dụng giới hạn 50%
    const maxDiscount = Math.floor(totalPrice * MAX_VOUCHER_RATIO);
    if (voucherDoc.discountAmount > maxDiscount) {
      discountAmount = maxDiscount;
      voucherCapped  = true;
    } else {
      discountAmount = voucherDoc.discountAmount;
    }
 
    voucherId = voucherDoc._id;
    // Chưa save ở đây — đợi có bookingId để gán usedInBookingId cùng 1 lần
  }
 
  const finalPrice    = Math.max(0, totalPrice - discountAmount);
  const depositAmount = Math.ceil(finalPrice / 2);
 
  const booking = await Booking.create({
    userId: userId || null,
    roomId,
    guestInfoId:   guestInfo._id,
    checkIn:       start,
    checkOut:      end,
    totalPrice,
    discountAmount,
    finalPrice,
    depositAmount,
    voucherId,
    status:        "pending",
    paymentStatus: "pending",
  });
 
  // Sau khi có bookingId → mark used + gán booking trong 1 lần save duy nhất
  if (voucherDoc) {
    voucherDoc.status          = "used";
    voucherDoc.usedInBookingId = booking._id;
    await voucherDoc.save();
  }
 
  await PaymentLog.create({
    bookingId: booking._id,
    actorId:   userId || null,
    action:    "booking_created",
    amount:    depositAmount,
    note: voucherId
      ? `Đặt phòng với voucher, giảm ${discountAmount} VND${voucherCapped ? " (đã giới hạn 50%)" : ""}`
      : userId ? "User đăng nhập đặt phòng" : "Khách vãng lai đặt phòng",
  });
 
  return {
    _id:            booking._id,
    roomId:         booking.roomId,
    checkIn:        booking.checkIn,
    checkOut:       booking.checkOut,
    totalPrice,
    discountAmount,
    finalPrice,
    depositAmount,
    qrDescription:  buildQRDescription(booking._id, depositAmount),
    voucherApplied: !!voucherId,
    voucherCapped,
    status:         booking.status,
    paymentStatus:  booking.paymentStatus,
    createdAt:      booking.createdAt,
    isGuest:        !userId,
    guestInfo: {
      fullName,
      phoneNumber,
      idNumber: maskIdNumber(idNumber),
    },
  };
}
 
function formatBooking(b, isAdmin) {
  let guestInfo = null;
  if (b.guestInfoId) {
    try {
      const d = decryptGuestInfo(b.guestInfoId);
      guestInfo = {
        fullName:    d.fullName,
        phoneNumber: d.phoneNumber,
        idNumber:    isAdmin ? d.idNumber : maskIdNumber(d.idNumber),
      };
    } catch {
      guestInfo = { error: "Không thể giải mã thông tin" };
    }
  }
  return {
    _id:            b._id,
    ...(isAdmin ? { user: b.userId } : {}),
    isGuest:        !b.userId,
    room:           b.roomId,
    checkIn:        b.checkIn,
    checkOut:       b.checkOut,
    totalPrice:     b.totalPrice,
    discountAmount: b.discountAmount || 0,
    finalPrice:     b.finalPrice || b.totalPrice,
    depositAmount:  b.depositAmount || Math.ceil(b.totalPrice / 2),
    voucher:        b.voucherId || null,
    status:         b.status,
    paymentStatus:  b.paymentStatus,
    pointsAwarded:  b.pointsAwarded,
    createdAt:      b.createdAt,
    guestInfo,
  };
}
 
async function getMyBookings(userId) {
  const bookings = await Booking.find({ userId })
    .populate("roomId")
    .populate("guestInfoId")
    .populate("voucherId", "code discountAmount")
    .sort({ createdAt: -1 });
  return bookings.map(b => formatBooking(b, false));
}
 
async function getAllBookings() {
  const bookings = await Booking.find()
    .populate("roomId")
    .populate("userId", "username email points")
    .populate("guestInfoId")
    .populate("voucherId", "code discountAmount")
    .sort({ createdAt: -1 });
  return bookings.map(b => formatBooking(b, true));
}
 
async function confirmBooking(bookingId, adminId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    const err = new Error("Booking không tồn tại"); err.status = 404; throw err;
  }
  if (booking.status !== "pending") {
    const err = new Error("Chỉ có thể xác nhận booking đang chờ"); err.status = 400; throw err;
  }
 
  booking.status        = "confirmed";
  booking.paymentStatus = "deposit_paid";
 
  if (booking.userId && booking.pointsAwarded === 0) {
    const points = await awardPoints(booking.userId, bookingId, booking.finalPrice);
    booking.pointsAwarded = points;
  }
 
  await booking.save();
 
  await PaymentLog.create({
    bookingId: booking._id,
    actorId:   adminId,
    action:    "booking_confirmed",
    amount:    booking.depositAmount,
    note:      `Admin xác nhận. Điểm cộng: ${booking.pointsAwarded}`,
  });
 
  await PaymentLog.create({
    bookingId: booking._id,
    actorId:   adminId,
    action:    "deposit_paid",
    amount:    booking.depositAmount,
  });
 
  return { booking, pointsAwarded: booking.pointsAwarded };
}
 
async function cancelBooking(bookingId, adminId) {
  const booking = await Booking.findById(bookingId).populate("voucherId");
  if (!booking) {
    const err = new Error("Booking không tồn tại"); err.status = 404; throw err;
  }
  if (booking.status === "cancelled") {
    const err = new Error("Booking đã bị hủy trước đó"); err.status = 400; throw err;
  }
 
  // Hoàn voucher nếu booking còn pending
  if (booking.voucherId && booking.status === "pending") {
    await Voucher.findByIdAndUpdate(booking.voucherId._id || booking.voucherId, {
      status:          "active",
      usedInBookingId: null,
    });
  }
 
  booking.status        = "cancelled";
  booking.paymentStatus = "refunded";
  await booking.save();
 
  await PaymentLog.create({
    bookingId: booking._id,
    actorId:   adminId,
    action:    "booking_cancelled",
    note:      "Admin hủy booking" + (booking.voucherId ? " — đã hoàn voucher" : ""),
  });
 
  return booking;
}
 
module.exports = { createBooking, getMyBookings, getAllBookings, confirmBooking, cancelBooking };