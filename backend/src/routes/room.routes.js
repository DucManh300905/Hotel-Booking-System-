const express = require("express");
const router  = express.Router();
 
const roomController = require("../controllers/room.controller");
const { createRoomValidator, updateRoomValidator } = require("../validators/room.validator");
const validate        = require("../middleware/validate.middleware");
const authMiddleware  = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const upload          = require("../config/multer");
 
// Upload: 1 ảnh chính + tối đa 5 ảnh gallery
const uploadFields = upload.fields([
  { name: "image",   maxCount: 1 },
  { name: "gallery", maxCount: 5 },
]);
 
router.get("/",    roomController.getAllRooms);
router.get("/:id", roomController.getRoomById);
 
router.post("/",
  authMiddleware, adminMiddleware,
  uploadFields,
  createRoomValidator, validate,
  roomController.createRoom
);
 
router.put("/:id",
  authMiddleware, adminMiddleware,
  uploadFields,
  updateRoomValidator, validate,
  roomController.updateRoom
);
 
router.delete("/:id",
  authMiddleware, adminMiddleware,
  roomController.deleteRoom
);
 
module.exports = router;