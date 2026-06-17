import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import roomApi from "../api/roomApi";
import BookingForm from "../components/booking/BookingForm";
import Loading from "../components/common/Loading";
import { fmtPrice } from "../utils/calculateNights";

const API_BASE = "http://localhost:5000";

function getImageUrl(image) {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `${API_BASE}/${image}`;
}

const DEFAULT_AMENITIES = [
  "🛏️ Giường đôi cao cấp", "❄️ Điều hòa nhiệt độ",
  "📶 WiFi miễn phí",       "📺 TV màn hình phẳng",
  "🚿 Phòng tắm riêng",     "☕ Minibar & Cà phê",
];

export default function RoomDetailPage({ showToast }) {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { isLoggedIn } = useAuth();

  const [room,        setRoom]        = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [activeImg,   setActiveImg]   = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [showAll,     setShowAll]     = useState(false);

  useEffect(() => {
    roomApi.getById(id)
      .then(setRoom)
      .catch(() => navigate("/rooms"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!room)   return null;

  const allImages = [
    room.image ? getImageUrl(room.image) : null,
    ...(room.gallery || []).map(getImageUrl),
  ].filter(Boolean);

  const amenities = room.amenities?.length > 0 ? room.amenities : DEFAULT_AMENITIES;

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"2rem 2.5rem", fontFamily:"var(--font-sans)" }}>

      {/* Breadcrumb */}
      <div style={{ fontSize:13, color:"rgba(12,15,20,.4)", marginBottom:20, display:"flex", gap:6, alignItems:"center" }}>
        <span onClick={() => navigate("/rooms")} style={{ cursor:"pointer", color:"#b8922a" }}>Phòng</span>
        <span>›</span>
        <span>{room.name}</span>
      </div>

      {/* Gallery */}
      {allImages.length > 0 ? (
        <div style={{ marginBottom:36 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, borderRadius:16, overflow:"hidden", maxHeight:480 }}>
            {/* Ảnh chính */}
            <div onClick={() => setShowAll(true)} style={{ cursor:"pointer", overflow:"hidden" }}>
              <img
                src={allImages[activeImg] || allImages[0]}
                alt={room.name}
                style={{ width:"100%", height:"100%", objectFit:"cover", minHeight:480, transition:"transform .3s" }}
                onMouseOver={e => e.target.style.transform = "scale(1.03)"}
                onMouseOut={e  => e.target.style.transform = "scale(1)"}
              />
            </div>

            {/* Grid ảnh phụ */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[1,2,3,4].map(i => (
                <div
                  key={i}
                  onClick={() => allImages[i] && setActiveImg(i)}
                  style={{
                    overflow:"hidden", cursor: allImages[i] ? "pointer" : "default",
                    background:"rgba(12,15,20,.06)", position:"relative",
                  }}
                >
                  {allImages[i] ? (
                    <>
                      <img src={allImages[i]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .3s" }}
                        onMouseOver={e => e.target.style.transform = "scale(1.05)"}
                        onMouseOut={e  => e.target.style.transform = "scale(1)"}
                      />
                      {i === 4 && allImages.length > 5 && (
                        <div onClick={() => setShowAll(true)} style={{
                          position:"absolute", inset:0,
                          background:"rgba(12,15,20,.55)",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          color:"#fff", fontSize:13, fontWeight:500, gap:6,
                        }}>
                          🖼 +{allImages.length - 4} ảnh
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{
                      width:"100%", height:"100%", minHeight:120,
                      background:"linear-gradient(135deg,#ede5d5,#d8cbb5)",
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem",
                    }}>🏨</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div style={{ display:"flex", gap:8, marginTop:10, overflowX:"auto", paddingBottom:4 }}>
              {allImages.map((img, i) => (
                <div key={i} onClick={() => setActiveImg(i)} style={{
                  width:72, height:52, flexShrink:0, borderRadius:8,
                  overflow:"hidden", cursor:"pointer",
                  border:`2px solid ${activeImg === i ? "#b8922a" : "transparent"}`,
                  transition:"border-color .2s",
                }}>
                  <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{
          height:360, borderRadius:16, marginBottom:36,
          background:"linear-gradient(135deg,#ede5d5,#d8cbb5)",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:"5rem",
        }}>🏨</div>
      )}

      {/* Content */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:40, alignItems:"start" }}>

        {/* LEFT */}
        <div>
          <div style={{ fontSize:10, letterSpacing:3, color:"#b8922a", textTransform:"uppercase", marginBottom:8 }}>
            ✦ Standard Room
          </div>
          <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"2.4rem", fontWeight:300, color:"#0c0f14", marginBottom:12 }}>
            {room.name}
          </h1>

          {/* Meta */}
          <div style={{ display:"flex", gap:20, marginBottom:24, flexWrap:"wrap" }}>
            {room.capacity && (
              <span style={{ fontSize:14, color:"rgba(12,15,20,.55)" }}>👥 {room.capacity} khách</span>
            )}
            {room.area && (
              <span style={{ fontSize:14, color:"rgba(12,15,20,.55)" }}>📐 {room.area} m²</span>
            )}
            <span style={{ fontSize:14, color:"rgba(12,15,20,.55)" }}>🛏️ Giường đôi</span>
          </div>

          <div style={{ width:56, height:2, background:"linear-gradient(90deg,#b8922a,transparent)", marginBottom:24 }} />

          {/* Description */}
          {room.description && (
            <div style={{ marginBottom:32 }}>
              <h2 style={{ fontFamily:"var(--font-serif)", fontSize:"1.3rem", fontWeight:400, color:"#0c0f14", marginBottom:12 }}>
                Tổng quan
              </h2>
              <p style={{ fontSize:14, color:"rgba(12,15,20,.6)", lineHeight:1.8 }}>
                {room.description}
              </p>
            </div>
          )}

          {/* Amenities */}
          <div style={{ marginBottom:32 }}>
            <h2 style={{ fontFamily:"var(--font-serif)", fontSize:"1.3rem", fontWeight:400, color:"#0c0f14", marginBottom:16 }}>
              Tiện nghi phòng
            </h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {amenities.map((a, i) => (
                <div key={i} style={{
                  display:"flex", alignItems:"center", gap:10,
                  padding:"10px 14px", background:"#fff",
                  border:"1.5px solid rgba(12,15,20,.07)", borderRadius:10,
                  fontSize:13, color:"#0c0f14",
                }}>
                  {a}
                </div>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div>
            <h2 style={{ fontFamily:"var(--font-serif)", fontSize:"1.3rem", fontWeight:400, color:"#0c0f14", marginBottom:16 }}>
              Chính sách
            </h2>
            {[
              { icon:"🕐", label:"Nhận phòng",  val:"Từ 14:00" },
              { icon:"🕑", label:"Trả phòng",   val:"Trước 12:00" },
              { icon:"💳", label:"Đặt cọc",     val:"50% tổng tiền phòng" },
              { icon:"🚫", label:"Hủy phòng",   val:"Miễn phí trước 24 giờ" },
            ].map(p => (
              <div key={p.label} style={{
                display:"flex", justifyContent:"space-between",
                padding:"12px 0", borderBottom:"1px solid rgba(12,15,20,.06)",
                fontSize:14,
              }}>
                <span style={{ color:"rgba(12,15,20,.5)" }}>{p.icon} {p.label}</span>
                <span style={{ fontWeight:500, color:"#0c0f14" }}>{p.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Booking card sticky */}
        <div style={{
          position:"sticky", top:80,
          background:"#fff", border:"1.5px solid rgba(12,15,20,.08)",
          borderRadius:20, padding:"24px",
          boxShadow:"0 8px 32px rgba(0,0,0,.1)",
        }}>
          <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"rgba(12,15,20,.4)", marginBottom:8 }}>
            Giá mỗi đêm
          </div>
          <div style={{ fontFamily:"var(--font-serif)", fontSize:"2.2rem", fontWeight:600, color:"#b8922a", marginBottom:4 }}>
            {fmtPrice(room.price)}
            <span style={{ fontSize:14, fontWeight:400, color:"rgba(184,146,42,.6)" }}> VND</span>
          </div>
          <div style={{ fontSize:12, color:"rgba(12,15,20,.4)", marginBottom:8 }}>
            Tiền cọc: {fmtPrice(Math.ceil(room.price / 2))} VND / đêm đầu
          </div>

          {/* Lợi ích tích điểm */}
          {isLoggedIn ? (
            <div style={{
              background:"rgba(45,120,85,.06)", border:"1px solid rgba(45,120,85,.15)",
              borderRadius:8, padding:"8px 12px", marginBottom:16, fontSize:12, color:"#2d7a5f",
            }}>
              ⭐ Đặt phòng này nhận được {Math.floor(room.price / 100000)} điểm / đêm
            </div>
          ) : (
            <div
              onClick={() => navigate("/login")}
              style={{
                background:"rgba(43,74,122,.06)", border:"1px solid rgba(43,74,122,.15)",
                borderRadius:8, padding:"8px 12px", marginBottom:16, fontSize:12,
                color:"#2b4a7a", cursor:"pointer",
              }}
            >
              💡 <span style={{ textDecoration:"underline" }}>Đăng nhập</span> để tích điểm đổi voucher
            </div>
          )}

          {/* Availability */}
          <div style={{
            display:"flex", alignItems:"center", gap:6,
            padding:"8px 12px", borderRadius:8, marginBottom:16,
            background: room.isAvailable ? "rgba(45,120,85,.08)" : "rgba(192,57,43,.08)",
            border:`1px solid ${room.isAvailable ? "rgba(45,120,85,.2)" : "rgba(192,57,43,.2)"}`,
            fontSize:12, fontWeight:500,
            color: room.isAvailable ? "#2d7a5f" : "#c0392b",
          }}>
            {room.isAvailable ? "✓ Còn phòng trống" : "✕ Hết phòng"}
          </div>

          <button
            onClick={() => setShowBooking(true)}
            disabled={!room.isAvailable}
            style={{
              width:"100%", padding:14,
              background: room.isAvailable
                ? "linear-gradient(135deg,#b8922a,#8a6a18)"
                : "rgba(12,15,20,.1)",
              border:"none", borderRadius:12,
              color: room.isAvailable ? "#fff" : "rgba(12,15,20,.3)",
              fontFamily:"var(--font-sans)", fontSize:15, fontWeight:500,
              cursor: room.isAvailable ? "pointer" : "not-allowed",
              marginBottom:10, transition:"opacity .2s",
            }}
            onMouseOver={e => { if (room.isAvailable) e.target.style.opacity = ".88"; }}
            onMouseOut={e  => { if (room.isAvailable) e.target.style.opacity = "1"; }}
          >
            {room.isAvailable ? "Đặt phòng ngay →" : "Không còn phòng"}
          </button>

          <button onClick={() => navigate("/rooms")} style={{
            width:"100%", padding:11, background:"transparent",
            border:"1.5px solid rgba(12,15,20,.09)", borderRadius:12,
            fontFamily:"var(--font-sans)", fontSize:14, cursor:"pointer", color:"#0c0f14",
          }}>
            ← Xem phòng khác
          </button>

          <p style={{ fontSize:11, color:"rgba(12,15,20,.35)", textAlign:"center", marginTop:14, lineHeight:1.7 }}>
            Không mất phí đặt chỗ · Hủy miễn phí trước 24h
          </p>
        </div>
      </div>

      {/* Booking modal */}
      {showBooking && (
        <BookingForm
          room={room}
          showToast={showToast}
          onClose={() => setShowBooking(false)}
          onSuccess={() => setShowBooking(false)}
        />
      )}

      {/* Lightbox */}
      {showAll && (
        <div
          onClick={() => setShowAll(false)}
          style={{
            position:"fixed", inset:0, background:"rgba(0,0,0,.92)",
            zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:20,
          }}
        >
          <button onClick={() => setShowAll(false)} style={{
            position:"absolute", top:20, right:20,
            background:"rgba(255,255,255,.1)", border:"none", borderRadius:"50%",
            width:44, height:44, color:"#fff", fontSize:20,
            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          }}>✕</button>
          <div style={{ display:"flex", flexDirection:"column", gap:12, maxHeight:"90vh", overflowY:"auto", width:"100%", maxWidth:800 }}>
            {allImages.map((img, i) => (
              <img key={i} src={img} alt={`${room.name} ${i+1}`}
                style={{ width:"100%", borderRadius:12, display:"block" }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
