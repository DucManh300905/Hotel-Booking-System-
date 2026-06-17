import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Loading from "../components/common/Loading";

export default function VerifyEmail() {
  const [status,    setStatus]    = useState("loading");
  const [confirming, setConfirming] = useState(false);
  const [params]    = useSearchParams();
  const navigate    = useNavigate();
  const token       = params.get("token");

  // Bước 1: GET — chỉ kiểm tra token còn hợp lệ không
  // Gmail bot sẽ hit GET này nhưng không làm hỏng token
  useEffect(() => {
    if (!token) { setStatus("invalid"); return; }
    axiosClient.get(`/auth/verify-email?token=${token}`)
      .then(() => setStatus("ready"))     // token hợp lệ → hiện nút xác nhận
      .catch(() => setStatus("invalid")); // token sai/hết hạn
  }, [token]);

  // Bước 2: POST — user bấm nút → mới thực sự verify
  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await axiosClient.post("/auth/verify-email", { token });
      setStatus("success");
    } catch {
      setStatus("invalid");
    }
    setConfirming(false);
  };

  if (status === "loading") return <Loading text="Đang kiểm tra link xác thực..." />;

  return (
    <div style={{
      minHeight: "calc(100vh - 60px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem", fontFamily: "var(--font-sans)",
    }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>

        {/* Icon */}
        <div style={{
          width: 72, height: 72, borderRadius: "50%", margin: "0 auto 1.5rem",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 30,
          background: status === "success" ? "rgba(45,120,85,.1)"
            : status === "ready"   ? "rgba(184,146,42,.1)"
            : "rgba(192,57,43,.1)",
          border: `1.5px solid ${
            status === "success" ? "rgba(45,120,85,.25)"
            : status === "ready" ? "rgba(184,146,42,.3)"
            : "rgba(192,57,43,.25)"
          }`,
        }}>
          {status === "success" ? "✓" : status === "ready" ? "✉" : "✕"}
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "var(--font-serif)", fontSize: "1.8rem",
          fontWeight: 400, color: "#0c0f14", marginBottom: 10,
        }}>
          {status === "success" ? "Xác thực thành công!"
            : status === "ready" ? "Xác nhận tài khoản"
            : "Link không hợp lệ"}
        </h2>

        {/* Description */}
        <p style={{ color: "rgba(12,15,20,.45)", fontSize: 14, marginBottom: 28, lineHeight: 1.7 }}>
          {status === "success"
            ? "Tài khoản của bạn đã được kích hoạt. Hãy đăng nhập để tiếp tục."
            : status === "ready"
            ? "Nhấn nút bên dưới để hoàn tất xác thực tài khoản của bạn."
            : "Link xác thực không hợp lệ hoặc đã hết hạn. Hãy đăng ký lại."}
        </p>

        {/* Button */}
        {status === "ready" && (
          <button
            onClick={handleConfirm}
            disabled={confirming}
            style={{
              padding: "13px 36px", border: "none", borderRadius: 10,
              background: confirming
                ? "rgba(12,15,20,.2)"
                : "linear-gradient(135deg,#b8922a,#8a6a18)",
              color: "#fff", fontFamily: "var(--font-sans)",
              fontSize: 14, fontWeight: 500,
              cursor: confirming ? "not-allowed" : "pointer",
              marginBottom: 16,
            }}
          >
            {confirming ? "Đang xác thực..." : "✓ Xác thực tài khoản"}
          </button>
        )}

        {(status === "success" || status === "invalid") && (
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "12px 32px", border: "none", borderRadius: 10,
              background: "linear-gradient(135deg,#b8922a,#8a6a18)",
              color: "#fff", fontFamily: "var(--font-sans)",
              fontSize: 14, fontWeight: 500, cursor: "pointer",
            }}
          >
            Về trang đăng nhập →
          </button>
        )}
      </div>
    </div>
  );
}
