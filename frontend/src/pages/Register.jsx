import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";

export default function Register({ showToast }) {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "calc(100vh - 60px)", display: "flex",
      alignItems: "center", justifyContent: "center",
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
            Tạo tài khoản
          </h2>
          <p style={{ color: "rgba(255,255,255,.35)", fontSize: 12, marginTop: 6 }}>
            Tạo tài khoản để bắt đầu đặt phòng
          </p>
        </div>

        <div style={{
          background: "#fff", borderRadius: "0 0 20px 20px",
          padding: "28px 32px 32px",
          boxShadow: "0 24px 64px rgba(0,0,0,.12)",
        }}>
          <RegisterForm
            showToast={showToast}
            onSuccess={() => navigate("/login")}
          />
          <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "rgba(12,15,20,.4)" }}>
            Đã có tài khoản?{" "}
            <Link to="/login" style={{ color: "#b8922a", fontWeight: 500, textDecoration: "none" }}>
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
