import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: "calc(100vh - 60px)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "3rem 2rem", textAlign: "center",
      fontFamily: "var(--font-sans)",
    }}>
      <div style={{
        fontSize: 10, letterSpacing: 3, color: "#b8922a",
        textTransform: "uppercase", marginBottom: 16,
      }}>
        ✦ Luxury Collection ✦
      </div>
      <h1 style={{
        fontFamily: "var(--font-serif)", fontSize: "3.5rem",
        fontWeight: 300, color: "#0c0f14", lineHeight: 1.2, marginBottom: 16,
      }}>
        Trải nghiệm lưu trú<br />
        <em style={{ color: "#b8922a", fontStyle: "italic" }}>đẳng cấp</em>
      </h1>
      <p style={{
        color: "rgba(12,15,20,.45)", fontSize: 15, maxWidth: 480,
        lineHeight: 1.8, marginBottom: 36,
      }}>
        Khám phá bộ sưu tập phòng cao cấp của chúng tôi.
        Đặt phòng nhanh chóng, an toàn và tiện lợi.
      </p>
      <button
        onClick={() => navigate("/rooms")}
        style={{
          padding: "14px 36px",
          background: "linear-gradient(135deg,#b8922a,#8a6a18)",
          border: "none", borderRadius: 12, color: "#fff",
          fontFamily: "var(--font-sans)", fontSize: 15,
          fontWeight: 500, cursor: "pointer", letterSpacing: ".3px",
          transition: "opacity .2s",
        }}
        onMouseOver={(e) => { e.target.style.opacity = ".88"; }}
        onMouseOut={(e)  => { e.target.style.opacity = "1"; }}
      >
        Xem danh sách phòng →
      </button>
    </div>
  );
}
