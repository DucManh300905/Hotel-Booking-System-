import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const ADMIN_TABS = [
  { path: "/admin/dashboard", label: "📊 Dashboard" },
  { path: "/admin/rooms",     label: "🏨 Quản lý phòng" },
];

export default function AdminLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const isActive  = (path) => location.pathname === path;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      {/* Admin tab bar */}
      <div style={{
        background: "#fff", borderBottom: "1px solid rgba(12,15,20,.08)",
        padding: "0 2.5rem", display: "flex", gap: 4,
      }}>
        {ADMIN_TABS.map((t) => (
          <button
            key={t.path}
            onClick={() => navigate(t.path)}
            style={{
              padding: "12px 18px", border: "none", background: "transparent",
              fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500,
              cursor: "pointer", transition: "all .2s",
              color:        isActive(t.path) ? "#b8922a" : "rgba(12,15,20,.45)",
              borderBottom: isActive(t.path) ? "2px solid #b8922a" : "2px solid transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <main style={{ flex: 1, padding: "2.5rem", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
