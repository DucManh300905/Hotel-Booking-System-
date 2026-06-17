import { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";

function AuthShell({ title, sub, children }) {
  return (
    <div style={{
      minHeight: "calc(100vh - 60px)", display: "flex",
      background: "#0c0f14",
    }}>
      {/* Left panel */}
      <div style={{
        width: 400, flexShrink: 0, padding: "3.5rem 3rem",
        display: "flex", flexDirection: "column", justifyContent: "center",
        borderRight: "1px solid rgba(255,255,255,.05)",
      }}>
        <span style={{
          fontSize: 9, letterSpacing: 3, color: "#d4af37",
          textTransform: "uppercase", display: "block", marginBottom: 16,
        }}>
          ✦ Luxury Collection ✦
        </span>
        <h1 style={{
          fontFamily: "var(--font-serif)", color: "#fff",
          fontSize: "2.6rem", fontWeight: 300, lineHeight: 1.2, marginBottom: 16,
        }}>
          Hotel<br /><em style={{ fontStyle: "italic", color: "#d4af37" }}>Booking</em> System
        </h1>
        <p style={{ color: "rgba(255,255,255,.35)", fontSize: 13, fontWeight: 300, lineHeight: 1.8 }}>
          Đăng nhập để tiếp tục trải nghiệm dịch vụ đẳng cấp của chúng tôi.
        </p>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center",
        justifyContent: "center", padding: "2rem",
        background: "#f8f5ef",
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <h2 style={{
            fontFamily: "var(--font-serif)", fontSize: "2rem",
            fontWeight: 400, color: "#0c0f14", marginBottom: 4,
          }}>
            {title}
          </h2>
          <p style={{ color: "rgba(12,15,20,.45)", fontSize: 13, marginBottom: 28 }}>{sub}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Login({ showToast }) {
  const [forgot, setForgot] = useState(false);

  if (forgot) {
    return (
      <AuthShell title="Quên mật khẩu" sub="Nhập email để nhận link đặt lại">
        <ForgotPasswordForm showToast={showToast} />
        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "rgba(12,15,20,.4)" }}>
          <span
            onClick={() => setForgot(false)}
            style={{ color: "#b8922a", cursor: "pointer", fontWeight: 500 }}
          >
            ← Quay lại đăng nhập
          </span>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Đăng nhập" sub="Tiếp tục để hoàn tất đặt phòng">
      <LoginForm showToast={showToast} />
      <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "rgba(12,15,20,.4)" }}>
        <span
          onClick={() => setForgot(true)}
          style={{ color: "#b8922a", cursor: "pointer", fontWeight: 500 }}
        >
          Quên mật khẩu?
        </span>
      </p>
      <p style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "rgba(12,15,20,.4)" }}>
        Chưa có tài khoản?{" "}
        <Link to="/register" style={{ color: "#b8922a", fontWeight: 500, textDecoration: "none" }}>
          Đăng ký ngay
        </Link>
      </p>
    </AuthShell>
  );
}
