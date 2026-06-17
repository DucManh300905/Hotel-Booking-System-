import { useNavigate } from "react-router-dom";
import { fmtPrice } from "../../utils/calculateNights";

const API_BASE = "http://localhost:5000";
const GRADIENTS = [
  "linear-gradient(135deg,#ede5d5,#d8cbb5)",
  "linear-gradient(135deg,#d5e1ed,#b5c8d8)",
  "linear-gradient(135deg,#e5d5ed,#c8b5d8)",
  "linear-gradient(135deg,#d5edd5,#b5d8b5)",
];

function getImageUrl(image) {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `${API_BASE}/${image}`;
}

export default function RoomCard({ room, index = 0, onBook }) {
  const navigate   = useNavigate();
  const imageUrl   = getImageUrl(room.image);

  return (
    <div className="card-hover" style={{
      background:"#fff", border:"1.5px solid rgba(12,15,20,.07)",
      borderRadius:16, overflow:"hidden",
      boxShadow:"0 4px 20px rgba(0,0,0,.06)",
      animation:`slideUp .35s ease ${index * 0.06}s both`,
    }}>
      {/* Thumbnail */}
      <div
        onClick={() => navigate(`/rooms/${room._id}`)}
        style={{
          height:180, overflow:"hidden", cursor:"pointer",
          background: imageUrl ? "transparent" : GRADIENTS[index % GRADIENTS.length],
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"3rem", position:"relative",
        }}
      >
        {imageUrl
          ? <img src={imageUrl} alt={room.name}
              style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .3s" }}
              onMouseOver={e => e.target.style.transform = "scale(1.05)"}
              onMouseOut={e  => e.target.style.transform = "scale(1)"}
            />
          : "🏨"
        }
        <span style={{
          position:"absolute", top:10, right:10,
          background: room.isAvailable ? "rgba(45,120,85,.85)" : "rgba(192,57,43,.85)",
          color:"#fff", fontSize:9, letterSpacing:1,
          textTransform:"uppercase", padding:"3px 9px", borderRadius:6,
        }}>
          {room.isAvailable ? "Còn phòng" : "Hết phòng"}
        </span>
        {room.gallery?.length > 0 && (
          <span style={{
            position:"absolute", bottom:10, right:10,
            background:"rgba(0,0,0,.5)", color:"#fff",
            fontSize:10, padding:"3px 8px", borderRadius:6,
          }}>
            🖼 {1 + room.gallery.length} ảnh
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding:"1.25rem" }}>
        <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"rgba(12,15,20,.35)", marginBottom:5 }}>
          Standard Room
          {room.area     ? ` · ${room.area}m²`      : ""}
          {room.capacity ? ` · ${room.capacity} khách` : ""}
        </div>
        <div
          onClick={() => navigate(`/rooms/${room._id}`)}
          style={{ fontWeight:600, fontSize:16, color:"#0c0f14", marginBottom:6, cursor:"pointer" }}
        >
          {room.name}
        </div>
        {room.description && (
          <div style={{
            fontSize:12, color:"rgba(12,15,20,.45)", marginBottom:10, lineHeight:1.5,
            display:"-webkit-box", WebkitLineClamp:2,
            WebkitBoxOrient:"vertical", overflow:"hidden",
          }}>
            {room.description}
          </div>
        )}
        <div style={{ color:"#b8922a", fontSize:17, fontWeight:500, marginBottom:16 }}>
          {fmtPrice(room.price)}
          <span style={{ color:"rgba(184,146,42,.5)", fontSize:12, fontWeight:400 }}> VND / đêm</span>
        </div>

        {/* 2 nút — không cần đăng nhập */}
        <div style={{ display:"flex", gap:8 }}>
          <button
            onClick={() => navigate(`/rooms/${room._id}`)}
            style={{
              flex:1, padding:"9px 0", background:"transparent",
              border:"1.5px solid rgba(12,15,20,.1)", borderRadius:9,
              color:"#0c0f14", fontFamily:"var(--font-sans)",
              fontSize:13, fontWeight:500, cursor:"pointer", transition:"background .2s",
            }}
            onMouseOver={e => e.currentTarget.style.background = "rgba(12,15,20,.04)"}
            onMouseOut={e  => e.currentTarget.style.background = "transparent"}
          >
            Xem chi tiết
          </button>
          <button
            onClick={() => onBook?.(room)}
            disabled={!room.isAvailable}
            style={{
              flex:1, padding:"9px 0",
              background: room.isAvailable
                ? "linear-gradient(135deg,#b8922a,#8a6a18)"
                : "rgba(12,15,20,.1)",
              border:"none", borderRadius:9,
              color: room.isAvailable ? "#fff" : "rgba(12,15,20,.3)",
              fontFamily:"var(--font-sans)", fontSize:13, fontWeight:500,
              cursor: room.isAvailable ? "pointer" : "not-allowed",
              transition:"opacity .2s",
            }}
            onMouseOver={e => { if (room.isAvailable) e.target.style.opacity = ".85"; }}
            onMouseOut={e  => { if (room.isAvailable) e.target.style.opacity = "1"; }}
          >
            {room.isAvailable ? "Đặt ngay →" : "Hết phòng"}
          </button>
        </div>
      </div>
    </div>
  );
}
