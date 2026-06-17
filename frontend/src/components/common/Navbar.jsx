import { useAuth } from "../../hooks/useAuth";
import { usePoints } from "../../hooks/usePoints";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { path:"/rooms",        label:"Phòng",           auth:false },
  { path:"/guest-lookup", label:"Tra cứu booking", auth:false },
  { path:"/my-bookings",  label:"Đặt chỗ của tôi", auth:true  },
  { path:"/points",       label:"Điểm & Voucher",  auth:true  },
];

const ADMIN_LINKS = [
  { path:"/admin/dashboard", label:"Dashboard"      },
  { path:"/admin/rooms",     label:"Quản lý phòng"  },
];

export default function Navbar() {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const { points } = usePoints();
  const navigate   = useNavigate();
  const location   = useLocation();
  const isActive   = p => location.pathname === p;

  const links = [
    ...NAV_LINKS.filter(l => !l.auth || isLoggedIn),
    ...(isAdmin ? ADMIN_LINKS : []),
  ];

  return (
    <nav style={{
      background:"#0c0f14", padding:"0 2.5rem",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      height:60, position:"sticky", top:0, zIndex:100,
      boxShadow:"0 2px 20px rgba(0,0,0,.2)",
    }}>
      {/* Logo */}
      <div onClick={() => navigate("/rooms")} style={{ cursor:"pointer" }}>
        <span style={{ fontFamily:"var(--font-serif)", color:"#fff", fontSize:"1.3rem", fontWeight:400 }}>
          Hotel <em style={{ color:"#d4af37", fontStyle:"italic" }}>System</em>
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display:"flex", gap:4 }}>
        {links.map(l => (
          <button key={l.path} onClick={() => navigate(l.path)} style={{
            padding:"6px 14px", border:"none", borderRadius:8, cursor:"pointer",
            fontFamily:"var(--font-sans)", fontSize:13, fontWeight:500, transition:"all .2s",
            background: isActive(l.path) ? "rgba(184,146,42,.15)" : "transparent",
            color:      isActive(l.path) ? "#d4af37"              : "rgba(255,255,255,.5)",
          }}>
            {l.label}
          </button>
        ))}
      </div>

      {/* Auth */}
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {isLoggedIn ? (
          <>
            {/* Badge điểm — chỉ fetch 1 lần / phút */}
            {points !== null && (
              <div
                onClick={() => navigate("/points")}
                style={{
                  display:"flex", alignItems:"center", gap:5,
                  background:"rgba(212,175,55,.12)", border:"1px solid rgba(212,175,55,.25)",
                  borderRadius:20, padding:"4px 12px", cursor:"pointer",
                  fontSize:12, color:"#d4af37", fontWeight:600,
                }}
              >
                ⭐ {points} điểm
              </div>
            )}
            <span style={{
              fontSize:12, color:"rgba(255,255,255,.35)",
              background:"rgba(255,255,255,.05)",
              padding:"5px 12px", borderRadius:20,
            }}>
              {isAdmin ? "Admin" : "User"}
            </span>
            <button onClick={logout} style={{
              padding:"7px 16px", border:"1px solid rgba(255,255,255,.12)",
              borderRadius:8, background:"transparent", color:"rgba(255,255,255,.5)",
              fontFamily:"var(--font-sans)", fontSize:12, cursor:"pointer",
            }}>
              Đăng xuất
            </button>
          </>
        ) : (
          <button onClick={() => navigate("/login")} style={{
            padding:"8px 20px", border:"none", borderRadius:9,
            background:"linear-gradient(135deg,#b8922a,#8a6a18)",
            color:"#fff", fontFamily:"var(--font-sans)",
            fontSize:13, fontWeight:500, cursor:"pointer",
          }}>
            Đăng nhập
          </button>
        )}
      </div>
    </nav>
  );
}
