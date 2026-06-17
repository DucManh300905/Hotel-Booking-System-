const pointService = require("../services/point.service");
const Voucher      = require("../models/Voucher");
 
async function getPointInfo(req, res, next) {
  try {
    res.json(await pointService.getPointInfo(req.user.id));
  } catch (err) { next(err); }
}
 
async function getVouchers(req, res, next) {
  try {
    res.json(await pointService.getVouchers(req.user.id));
  } catch (err) { next(err); }
}
 
async function redeemVoucher(req, res, next) {
  try {
    const { tierIndex } = req.body;
    if (tierIndex === undefined) return res.status(400).json({ message: "Vui lòng chọn mức đổi" });
    const result = await pointService.redeemVoucher(req.user.id, Number(tierIndex));
    res.json({
      message:         `Đổi voucher thành công! Mã: ${result.voucher.code}`,
      voucher:         result.voucher,
      remainingPoints: result.remainingPoints,
    });
  } catch (err) { next(err); }
}
 
async function validateVoucher(req, res, next) {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Nhập mã voucher" });
 
    const voucher = await Voucher.findOne({
      code:      code.toUpperCase().trim(),
      userId:    req.user.id,
      status:    "active",
      expiresAt: { $gt: new Date() },
    });
 
    if (!voucher) {
      return res.status(400).json({ message: "Voucher không hợp lệ hoặc đã hết hạn" });
    }
 
    res.json({
      valid:          true,
      code:           voucher.code,
      discountAmount: voucher.discountAmount,
      expiresAt:      voucher.expiresAt,
    });
  } catch (err) { next(err); }
}
 
module.exports = { getPointInfo, getVouchers, redeemVoucher, validateVoucher };