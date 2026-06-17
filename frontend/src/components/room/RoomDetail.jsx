import { fmtPrice } from "../../utils/calculateNights";

export default function RoomDetail({ room }) {
  if (!room) return null;
  return (
    <div style={{
      background: "#fff", borderRadius: 16, overflow: "hidden",
      border: "1.5px solid rgba(12,15,20,.07)",
      boxShadow: "0 4px 20px rgba(0,0,0,.06)",
    }}>
      <div style={{
        height: 200, background: "linear-gradient(135deg,#ede5d5,#d8cbb5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "4rem",
      }}>
        🏨
      </div>
      <div style={{ padding: "1.5rem" }}>
        <div style={{
          fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
          color: "rgba(12,15,20,.35)", marginBottom: 6,
        }}>
          Standard Room
        </div>
        <div style={{ fontWeight: 600, fontSize: 20, color: "#0c0f14", marginBottom: 8 }}>
          {room.name}
        </div>
        {room.description && (
          <p style={{
            fontSize: 14, color: "rgba(12,15,20,.55)",
            lineHeight: 1.7, marginBottom: 12,
          }}>
            {room.description}
          </p>
        )}
        <div style={{ color: "#b8922a", fontSize: 20, fontWeight: 500 }}>
          {fmtPrice(room.price)}
          <span style={{ fontSize: 13, color: "rgba(184,146,42,.5)", fontWeight: 400 }}>
            {" "}VND / đêm
          </span>
        </div>
      </div>
    </div>
  );
}
