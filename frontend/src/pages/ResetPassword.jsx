import ResetPasswordForm from "../components/auth/ResetPasswordForm";

export default function ResetPassword({ showToast }) {
  return (
    <div style={{
      minHeight: "calc(100vh - 60px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem", background: "#f8f5ef",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{
          background: "#0c0f14", borderRadius: "20px 20px 0 0",
          padding: "28px 32px 24px",
        }}>
          <div style={{
            fontSize: 9, letterSpacing: 3, color: "#d4af37",
            textTransform: "uppercase", marginBottom: 8,
          }}>
            ✦ Hotel Booking System ✦
          </div>
          <h2 style={{
            fontFamily: "var(--font-serif)", color: "#fff",
            fontSize: "1.7rem", fontWeight: 300,
          }}>
            Đặt lại mật khẩu
          </h2>
          <p style={{ color: "rgba(255,255,255,.35)", fontSize: 12, marginTop: 6 }}>
            Nhập mật khẩu mới của bạn bên dưới
          </p>
        </div>
        <div style={{
          background: "#fff", borderRadius: "0 0 20px 20px",
          padding: "28px 32px 32px",
          boxShadow: "0 24px 64px rgba(0,0,0,.12)",
        }}>
          <ResetPasswordForm showToast={showToast} />
        </div>
      </div>
    </div>
  );
}
