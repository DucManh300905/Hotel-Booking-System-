const fs   = require("fs");
const path = require("path");
const Room = require("../models/Room");
 
function deleteImageFile(imagePath) {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, "../../", imagePath);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
}
 
async function getAllRooms() {
  return Room.find().sort({ createdAt: -1 });
}
 
async function getRoomById(id) {
  const room = await Room.findById(id);
  if (!room) {
    const err = new Error("Phòng không tồn tại"); err.status = 404; throw err;
  }
  return room;
}
 
async function createRoom({ name, price, description, amenities, area, capacity, imagePath, galleryPaths }) {
  return Room.create({
    name, price, description, amenities,
    area, capacity,
    image:   imagePath    || null,
    gallery: galleryPaths || [],
  });
}
 
async function updateRoom(id, updates, newImagePath, newGalleryPaths) {
  const room = await Room.findById(id);
  if (!room) {
    const err = new Error("Phòng không tồn tại"); err.status = 404; throw err;
  }
 
  if (newImagePath) {
    deleteImageFile(room.image);
    updates.image = newImagePath;
  }
 
  if (newGalleryPaths && newGalleryPaths.length > 0) {
    // Xóa ảnh gallery cũ
    room.gallery.forEach(deleteImageFile);
    updates.gallery = newGalleryPaths;
  }
 
  Object.assign(room, updates);
  await room.save();
  return room;
}
 
async function deleteRoom(id) {
  const room = await Room.findByIdAndDelete(id);
  if (!room) {
    const err = new Error("Phòng không tồn tại"); err.status = 404; throw err;
  }
  deleteImageFile(room.image);
  room.gallery.forEach(deleteImageFile);
}
 
module.exports = { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom };