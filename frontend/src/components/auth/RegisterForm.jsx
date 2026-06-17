import { useState } from "react";
import authApi from "../../api/authApi";
import InputField from "../common/InputField";
import Btn from "../common/Btn";

export default function RegisterForm({ showToast, onSuccess }) {
  const [form,    setForm]    = useState({ username: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.username) { showToast("Nhập tên tài khoản", "error"); return; }
    if (!form.email)    { showToast("Nhập email", "error"); return; }
    if (form.password.length < 6) { showToast("Mật khẩu tối thiểu 6 ký tự", "error"); return; }
    if (form.password !== form.confirm) { showToast("Mật khẩu xác nhận không khớp", "error"); return; }

    setLoading(true);
    try {
      const data = await authApi.register({
        username: form.username,
        email:    form.email,
        password: form.password,
      });
      showToast(data.message || "Đăng ký thành công! Hãy xác thực email.", "success");
      onSuccess?.();
    } catch (e) {
      showToast(e.message, "error");
    }
    setLoading(false);
  };

  return (
    <div>
      <InputField
        label="Tên tài khoản" placeholder="Tối thiểu 3 ký tự" icon="👤"
        value={form.username} onChange={set("username")}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <InputField
        label="Email" type="email" placeholder="example@email.com" icon="✉"
        value={form.email} onChange={set("email")}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <InputField
        label="Mật khẩu" type="password" placeholder="••••••••" icon="🔒"
        value={form.password} onChange={set("password")}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <InputField
        label="Xác nhận mật khẩu" type="password" placeholder="••••••••" icon="🔒"
        value={form.confirm} onChange={set("confirm")}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <Btn onClick={handleSubmit} disabled={loading}>
        {loading ? "Đang đăng ký..." : "Đăng ký →"}
      </Btn>
    </div>
  );
}
