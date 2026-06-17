const crypto  = require("crypto");
const User    = require("../models/User");
const PointLog = require("../models/PointLog");
const Voucher  = require("../models/Voucher");
const { VOUCHER_TIERS } = require("../models/Voucher");

/* ── Tỷ lệ tích điểm ──
 * Mỗi 100.000 VND = 1 điểm
 */
const POINTS_PER_VND = 100000;

function calculatePoints(totalPrice) {
  return Math.floor(totalPrice / POINTS_PER_VND);
}

/* ── Cộng điểm khi booking confirmed ── */
async function awardPoints(userId, bookingId, totalPrice) {
  if (!userId) return 0; // guest không có điểm

  const points = calculatePoints(totalPrice);
  if (points <= 0) return 0;

  const user = await User.findById(userId);
  if (!user) return 0;

  user.points += points;
  await user.save();

  await PointLog.create({
    userId,
    bookingId,
    action:       "earned",
    points,
    balanceAfter: user.points,
    note:         `Tích điểm từ booking #${String(bookingId).slice(-8).toUpperCase()}`,
  });

  return points;
}

/* ── Lấy thông tin điểm của user ── */
async function getPointInfo(userId) {
  const user = await User.findById(userId).select("points");
  if (!user) {
    const err = new Error("User không tồn tại"); err.status = 404; throw err;
  }

  const logs = await PointLog.find({ userId })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("bookingId", "checkIn checkOut totalPrice");

  return {
    points: user.points,
    tiers:  VOUCHER_TIERS,
    logs,
  };
}

/* ── Đổi điểm lấy voucher ── */
async function redeemVoucher(userId, tierIndex) {
  const tier = VOUCHER_TIERS[tierIndex];
  if (!tier) {
    const err = new Error("Mức đổi không hợp lệ"); err.status = 400; throw err;
  }

  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User không tồn tại"); err.status = 404; throw err;
  }

  if (user.points < tier.points) {
    const err = new Error(`Không đủ điểm. Cần ${tier.points} điểm, bạn có ${user.points} điểm`);
    err.status = 400; throw err;
  }

  // Tạo mã voucher ngẫu nhiên — VD: HBS-A1B2C3
  const code = "HBS-" + crypto.randomBytes(3).toString("hex").toUpperCase();

  // Hết hạn sau 30 ngày
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const voucher = await Voucher.create({
    userId,
    code,
    pointsUsed:     tier.points,
    discountAmount: tier.discount,
    expiresAt,
  });

  // Trừ điểm
  user.points -= tier.points;
  await user.save();

  // Ghi log
  await PointLog.create({
    userId,
    action:       "redeemed",
    points:       -tier.points,
    balanceAfter: user.points,
    note:         `Đổi voucher ${code} — ${tier.label}`,
  });

  return { voucher, remainingPoints: user.points };
}

/* ── Lấy danh sách voucher của user ── */
async function getVouchers(userId) {
  // Tự động expire voucher quá hạn
  await Voucher.updateMany(
    { userId, status: "active", expiresAt: { $lt: new Date() } },
    { $set: { status: "expired" } }
  );

  return Voucher.find({ userId }).sort({ createdAt: -1 });
}

module.exports = { calculatePoints, awardPoints, getPointInfo, redeemVoucher, getVouchers };
