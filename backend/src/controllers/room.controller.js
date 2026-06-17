const roomService = require("../services/room.service");
 
async function getAllRooms(req, res, next) {
  try {
    res.json(await roomService.getAllRooms());
  } catch (err) { next(err); }
}
 
async function getRoomById(req, res, next) {
  try {
    res.json(await roomService.getRoomById(req.params.id));
  } catch (err) { next(err); }
}
 
async function createRoom(req, res, next) {
  try {
    const { name, price, description, amenities, area, capacity } = req.body;
    const files = req.files || {};
 
    // Ảnh chính
    const imagePath = files.image?.[0]
      ? files.image[0].path.replace(/\\/g, "/")
      : null;
 
    // Ảnh gallery
    const galleryPaths = (files.gallery || []).map(f =>
      f.path.replace(/\\/g, "/")
    );
 
    // amenities có thể là string JSON hoặc array
    let parsedAmenities = [];
    if (amenities) {
      try { parsedAmenities = JSON.parse(amenities); } catch { parsedAmenities = [amenities]; }
    }
 
    const room = await roomService.createRoom({
      name, price, description,
      amenities: parsedAmenities,
      area:      area ? Number(area) : null,
      capacity:  capacity ? Number(capacity) : 2,
      imagePath,
      galleryPaths,
    });
    res.status(201).json(room);
  } catch (err) { next(err); }
}
 
async function updateRoom(req, res, next) {
  try {
    const updates = { ...req.body };
    const files   = req.files || {};
 
    const newImagePath = files.image?.[0]
      ? files.image[0].path.replace(/\\/g, "/")
      : null;
 
    const newGalleryPaths = (files.gallery || []).map(f =>
      f.path.replace(/\\/g, "/")
    );
 
    if (updates.price)    updates.price    = Number(updates.price);
    if (updates.area)     updates.area     = Number(updates.area);
    if (updates.capacity) updates.capacity = Number(updates.capacity);
 
    if (updates.amenities) {
      try { updates.amenities = JSON.parse(updates.amenities); } catch { updates.amenities = [updates.amenities]; }
    }
 
    const room = await roomService.updateRoom(
      req.params.id, updates, newImagePath, newGalleryPaths
    );
    res.json(room);
  } catch (err) { next(err); }
}
 
async function deleteRoom(req, res, next) {
  try {
    await roomService.deleteRoom(req.params.id);
    res.json({ message: "Xóa phòng thành công" });
  } catch (err) { next(err); }
}
 
module.exports = { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom };