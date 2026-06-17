const lookupService = require("../services/lookup.service");
 
/* ── POST /api/bookings/lookup ──
 * Body: { phoneNumber }
 * Không cần auth — guest tra cứu bằng SĐT
 */
async function lookupByPhone(req, res, next) {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ message: "Vui lòng nhập số điện thoại" });
    }
    const bookings = await lookupService.lookupByPhone(phoneNumber);
    res.json(bookings);
  } catch (err) { next(err); }
}
 
module.exports = { lookupByPhone };
 