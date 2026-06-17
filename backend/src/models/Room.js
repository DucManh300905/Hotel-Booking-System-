const mongoose = require("mongoose");
 
const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String, required: true, trim: true,
    },
    price: {
      type: Number, required: true, min: 0,
    },
    description: {
      type: String, trim: true, default: "",
    },
    // Ảnh chính
    image: {
      type: String, default: null,
    },
    // Ảnh gallery — tối đa 5 ảnh phụ
    gallery: {
      type: [String], default: [],
    },
    // Tiện nghi
    amenities: {
      type: [String], default: [],
    },
    // Diện tích (m²)
    area: {
      type: Number, default: null,
    },
    // Sức chứa (số khách)
    capacity: {
      type: Number, default: 2,
    },
    isAvailable: {
      type: Boolean, default: true,
    },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("Room", roomSchema);