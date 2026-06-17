const bookingService = require("../services/booking.service");
 
/* ── POST /api/bookings ──
 * Không cần đăng nhập — userId lấy từ token nếu có, null nếu guest
 */
async function createBooking(req, res, next) {
  try {
    const { roomId, checkIn, checkOut, fullName, phoneNumber, idNumber, voucherCode } = req.body;
    const userId  = req.user?.id || null;
    const booking = await bookingService.createBooking(userId, {
      roomId, checkIn, checkOut, fullName, phoneNumber, idNumber,
      voucherCode, // ← fix: truyền xuống service
    });
    res.status(201).json({ message: "Đặt phòng thành công!", booking });
  } catch (err) { next(err); }
}
 
/* ── GET /api/bookings/my ── user đã đăng nhập */
async function getMyBookings(req, res, next) {
  try {
    res.json(await bookingService.getMyBookings(req.user.id));
  } catch (err) { next(err); }
}
 
/* ── GET /api/bookings ── admin */
async function getAllBookings(req, res, next) {
  try {
    res.json(await bookingService.getAllBookings());
  } catch (err) { next(err); }
}
 
/* ── PATCH /api/bookings/:id/confirm ── admin */
async function confirmBooking(req, res, next) {
  try {
    const result = await bookingService.confirmBooking(req.params.id, req.user.id);
    res.json({
      message:       "Xác nhận booking thành công!",
      booking:       result.booking,
      pointsAwarded: result.pointsAwarded,
    });
  } catch (err) { next(err); }
}
 
/* ── PATCH /api/bookings/:id/cancel ── admin */
async function cancelBooking(req, res, next) {
  try {
    const booking = await bookingService.cancelBooking(req.params.id, req.user.id);
    res.json({ message: "Đã hủy booking!", booking });
  } catch (err) { next(err); }
}
 
module.exports = { createBooking, getMyBookings, getAllBookings, confirmBooking, cancelBooking };
 