const express = require("express");
const cors    = require("cors");
const path    = require("path");
const fs      = require("fs");
 
const connectDB        = require("./config/db");
const helmetMiddleware = require("./config/helmet");
const { globalLimiter } = require("./middleware/rateLimiter");
const errorMiddleware  = require("./middleware/error.middleware");
 
const authRoutes    = require("./routes/auth.routes");
const roomRoutes    = require("./routes/room.routes");
const bookingRoutes = require("./routes/booking.routes");
const pointRoutes   = require("./routes/point.routes");
 
const app = express();
 
/* ── Tạo thư mục uploads nếu chưa có ── */
const uploadsDir = path.join(__dirname, "../uploads/rooms");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
 
/* ── Kết nối DB ── */
connectDB();
 
/* ── Body parsing ── */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
 
/* ── Security ── */
app.use(helmetMiddleware);
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
 
/* ── Global rate limit — chỉ chặn DDoS ── */
app.use(globalLimiter);
 
/* ── Serve ảnh tĩnh ── */
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
 
/* ── Routes ── */
app.use("/api/auth",     authRoutes);
app.use("/api/rooms",    roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/points",   pointRoutes);
 
/* ── Health check ── */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
 
/* ── 404 ── */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
 
/* ── Global error handler ── */
app.use(errorMiddleware);
 
module.exports = app;