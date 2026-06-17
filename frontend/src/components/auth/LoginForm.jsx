import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import authApi from "../../api/authApi";
import InputField from "../common/InputField";
import Btn from "../common/Btn";

export default function LoginForm({ showToast }) {
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const from = location.state?.from?.pathname || "/rooms";
  const set  = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      showToast("Nhập đầy đủ email và mật khẩu", "error"); return;
    }
    setLoading(true);
    try {
      const data = await authApi.login(form);
      login(data.token);
      showToast("Đăng nhập thành công!", "success");
      navigate(from, { replace: true });
    } catch (e) {
      showToast(e.message, "error");
    }
    setLoading(false);
  };

  return (
    <div>
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
      <Btn onClick={handleSubmit} disabled={loading}>
        {loading ? "Đang đăng nhập..." : "Đăng nhập →"}
      </Btn>
    </div>
  );
}
