import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authApi from "../../api/authApi";
import InputField from "../common/InputField";
import Btn from "../common/Btn";

export default function ResetPasswordForm({ showToast }) {
  const [form,    setForm]    = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const token     = params.get("token");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (form.password.length < 6) {
      showToast("Mật khẩu phải có ít nhất 6 ký tự", "error"); return;
    }
    if (form.password !== form.confirm) {
      showToast("Mật khẩu xác nhận không khớp", "error"); return;
    }
    if (!token) {
      showToast("Token không hợp lệ", "error"); return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword(token, form.password, form.confirm);
      setDone(true);
      showToast("Đặt lại mật khẩu thành công!", "success");
    } catch (e) {
      showToast(e.message, "error");
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "rgba(45,120,85,.1)",
          border: "1.5px solid rgba(45,120,85,.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, margin: "0 auto 1.5rem",
        }}>✓</div>
        <p style={{ color: "rgba(12,15,20,.55)", fontSize: 14, marginBottom: "1.5rem" }}>
          Mật khẩu đã được cập nhật thành công.
        </p>
        <Btn onClick={() => navigate("/login")}>
          Về trang đăng nhập →
        </Btn>
      </div>
    );
  }

  return (
    <div>
      <InputField
        label="Mật khẩu mới" type="password" placeholder="••••••••" icon="🔒"
        value={form.password} onChange={set("password")}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <InputField
        label="Xác nhận mật khẩu mới" type="password" placeholder="••••••••" icon="🔒"
        value={form.confirm} onChange={set("confirm")}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <Btn onClick={handleSubmit} disabled={loading}>
        {loading ? "Đang xử lý..." : "Đặt lại mật khẩu →"}
      </Btn>
    </div>
  );
}
