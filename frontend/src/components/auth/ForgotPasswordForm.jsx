import { useState } from "react";
import authApi from "../../api/authApi";
import InputField from "../common/InputField";
import Btn from "../common/Btn";

export default function ForgotPasswordForm({ showToast }) {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async () => {
    if (!email) { showToast("Nhập email", "error"); return; }
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
      showToast("Đã gửi email đặt lại mật khẩu!", "success");
    } catch (e) {
      showToast(e.message, "error");
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div style={{
        background: "#f0faf5", border: "1px solid rgba(45,120,85,.2)",
        borderRadius: 12, padding: "16px 20px", fontSize: 14,
        color: "#2d7a5f", lineHeight: 1.7,
      }}>
        ✓ Chúng tôi đã gửi link đặt lại mật khẩu tới <strong>{email}</strong>.
        Link có hiệu lực trong <strong>15 phút</strong>. Hãy kiểm tra cả thư mục spam.
      </div>
    );
  }

  return (
    <div>
      <InputField
        label="Email" type="email" placeholder="example@email.com" icon="✉"
        value={email} onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <Btn onClick={handleSubmit} disabled={loading}>
        {loading ? "Đang gửi..." : "Gửi link đặt lại →"}
      </Btn>
    </div>
  );
}
