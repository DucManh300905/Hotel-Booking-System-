const express = require("express");
const router  = express.Router();
 
const pointController = require("../controllers/point.controller");
const authMiddleware  = require("../middleware/auth.middleware");
 
router.use(authMiddleware);
 
router.get("/",                  pointController.getPointInfo);
router.get("/vouchers",          pointController.getVouchers);
router.post("/redeem",           pointController.redeemVoucher);
router.post("/validate-voucher", pointController.validateVoucher);
 
module.exports = router;
 