const express = require("express");
const router  = express.Router();
 
const bookingController  = require("../controllers/booking.controller");
const lookupController   = require("../controllers/lookup.controller");
const { createBookingValidator } = require("../validators/booking.validator");
const validate        = require("../middleware/validate.middleware");
const authMiddleware  = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const optionalAuth    = require("../middleware/optionalAuth.middleware");
const { lookupLimiter } = require("../middleware/rateLimiter");
 
// POST /api/bookings — không bắt buộc đăng nhập
router.post("/",
  optionalAuth,
  createBookingValidator, validate,
  bookingController.createBooking
);
 
// POST /api/bookings/lookup — tra cứu bằng SĐT, giới hạn chặt
router.post("/lookup",
  lookupLimiter,
  lookupController.lookupByPhone
);
 
// GET /api/bookings/my
router.get("/my", authMiddleware, bookingController.getMyBookings);
 
// GET /api/bookings — admin
router.get("/", authMiddleware, adminMiddleware, bookingController.getAllBookings);
 
// PATCH confirm / cancel — admin
router.patch("/:id/confirm", authMiddleware, adminMiddleware, bookingController.confirmBooking);
router.patch("/:id/cancel",  authMiddleware, adminMiddleware, bookingController.cancelBooking);
 
module.exports = router;