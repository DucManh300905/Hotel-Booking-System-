import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: "calc(100vh - 60px)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-sans)", textAlign: "center", padding: "2rem",
    }}>
      <div style={{
        fontFamily: "var(--font-serif)", fontSize: "8rem",
        fontWeight: 300, color: "rgba(12,15,20,.08)", lineHeight: 1,
        marginBottom: 16,
      }}>
        404
      </div>
      <h2 style={{
        fontFamily: "var(--font-serif)", fontSize: "1.8rem",
        fontWeight: 400, color: "#0c0f14", marginBottom: 10,
      }}>
        Trang không tồn tại
      </h2>
      <p style={{ color: "rgba(12,15,20,.4)", fontSize: 14, marginBottom: 28 }}>
        Đường dẫn bạn truy cập không tồn tại hoặc đã bị xóa.
      </p>
      <button
        onClick={() => navigate("/rooms")}
        style={{
          padding: "12px 28px",
          background: "linear-gradient(135deg,#b8922a,#8a6a18)",
          border: "none", borderRadius: 10, color: "#fff",
          fontFamily: "var(--font-sans)", fontSize: 14,
          fontWeight: 500, cursor: "pointer",
        }}
      >
        Về trang chủ →
      </button>
    </div>
  );
}
