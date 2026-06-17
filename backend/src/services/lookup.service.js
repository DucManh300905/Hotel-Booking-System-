const Booking   = require("../models/Booking");
const GuestInfo = require("../models/GuestInfo");
const { decryptGuestInfo } = require("./encryption.service");
const { maskIdNumber }     = require("../utils/maskSensitiveData");
 
/**
 * Tra cứu booking theo số điện thoại.
 * Decrypt từng GuestInfo rồi so sánh phoneNumber.
 * Chỉ trả về booking trong 6 tháng gần nhất để giới hạn.
 */
async function lookupByPhone(phoneNumber) {
  if (!phoneNumber || !/^[0-9]{9,11}$/.test(phoneNumber)) {
    const err = new Error("Số điện thoại không hợp lệ"); err.status = 400; throw err;
  }
 
  // Lấy booking 6 tháng gần nhất
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
 
  const bookings = await Booking.find({
    createdAt: { $gte: sixMonthsAgo },
  })
    .populate("roomId")
    .populate("guestInfoId")
    .sort({ createdAt: -1 });
 
  // Lọc booking có SĐT khớp sau khi decrypt
  const matched = [];
 
  for (const b of bookings) {
    if (!b.guestInfoId) continue;
    try {
      const decrypted = decryptGuestInfo(b.guestInfoId);
      if (decrypted.phoneNumber === phoneNumber) {
        matched.push({
          _id:        b._id,
          room:       b.roomId,
          checkIn:    b.checkIn,
          checkOut:   b.checkOut,
          totalPrice: b.totalPrice,
          depositAmount: b.depositAmount,
          status:        b.status,
          paymentStatus: b.paymentStatus,
          createdAt:     b.createdAt,
          guestInfo: {
            fullName:    decrypted.fullName,
            phoneNumber: decrypted.phoneNumber,
            idNumber:    maskIdNumber(decrypted.idNumber), // che bớt CCCD
          },
        });
      }
    } catch {
      // Bỏ qua nếu decrypt lỗi
    }
  }
 
  return matched;
}
 
module.exports = { lookupByPhone };