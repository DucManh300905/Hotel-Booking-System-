import { useState, useEffect } from "react";
import pointApi from "../api/pointApi";
import { usePoints } from "../hooks/usePoints";
import Loading from "../components/common/Loading";
import { fmtPrice } from "../utils/calculateNights";
import { fmtDate } from "../utils/formatDate";

function VoucherCard({ voucher }) {
  const isActive = voucher.status === "active" && new Date(voucher.expiresAt) > new Date();
  const cfg = {
    active:  { label:"Còn hiệu lực", color:"#2d7a5f",          bg:"rgba(45,120,85,.08)",   border:"rgba(45,120,85,.2)"   },
    used:    { label:"Đã sử dụng",   color:"rgba(12,15,20,.4)", bg:"rgba(12,15,20,.04)",    border:"rgba(12,15,20,.1)"    },
    expired: { label:"Hết hạn",      color:"#c0392b",           bg:"rgba(192,57,43,.06)",   border:"rgba(192,57,43,.2)"   },
  };
  const s = cfg[voucher.status] || cfg.expired;

  return (
    <div style={{
      background: isActive ? "#fff" : "rgba(12,15,20,.02)",
      border:`1.5px solid ${isActive ? "rgba(184,146,42,.25)" : "rgba(12,15,20,.07)"}`,
      borderRadius:14, padding:"16px 20px",
      boxShadow: isActive ? "0 4px 16px rgba(184,146,42,.1)" : "none",
      opacity: isActive ? 1 : .7,
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"rgba(12,15,20,.4)", marginBottom:6 }}>
            Voucher giảm giá
          </div>
          <div style={{ fontFamily:"var(--font-serif)", fontSize:"1.6rem", fontWeight:600, color:"#b8922a", marginBottom:6 }}>
            {fmtPrice(voucher.discountAmount)} VND
          </div>
          <div style={{
            fontFamily:"monospace", fontSize:15, fontWeight:600, letterSpacing:2,
            padding:"6px 12px", borderRadius:8, display:"inline-block",
            color: isActive ? "#0c0f14" : "rgba(12,15,20,.4)",
            background: isActive ? "rgba(184,146,42,.08)" : "rgba(12,15,20,.04)",
          }}>
            {voucher.code}
          </div>
        </div>
        <span style={{
          fontSize:10, letterSpacing:1, textTransform:"uppercase",
          padding:"4px 10px", borderRadius:20, fontWeight:500,
          background:s.bg, border:`1px solid ${s.border}`, color:s.color,
        }}>
          {s.label}
        </span>
      </div>
      <div style={{ marginTop:10, fontSize:12, color:"rgba(12,15,20,.4)", display:"flex", gap:16 }}>
        <span>Dùng: {voucher.pointsUsed} điểm</span>
        <span>HSD: {fmtDate(voucher.expiresAt)}</span>
      </div>
    </div>
  );
}

export default function PointsPage() {
  const { refresh } = usePoints(); // để refresh badge Navbar sau khi đổi
  const [info,      setInfo]      = useState(null);
  const [vouchers,  setVouchers]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [tab,       setTab]       = useState("points");

  const load = async () => {
    try {
      const [infoData, voucherData] = await Promise.all([
        pointApi.getInfo(),
        pointApi.getVouchers(),
      ]);
      setInfo(infoData);
      setVouchers(voucherData);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleRedeem = async (tierIndex) => {
    const tier = info.tiers[tierIndex];
    if (!window.confirm(`Đổi ${tier.points} điểm lấy voucher ${tier.label}?`)) return;
    setRedeeming(true);
    try {
      await pointApi.redeem(tierIndex);
      await load();
      refresh(); // cập nhật badge Navbar
      setTab("vouchers");
    } catch (e) { alert(e.message); }
    setRedeeming(false);
  };

  if (loading) return <Loading />;

  const activeVouchers = vouchers.filter(v => v.status === "active");

  return (
    <div style={{ padding:"2.5rem", maxWidth:760, margin:"0 auto", fontFamily:"var(--font-sans)" }}>

      {/* Header */}
      <div style={{ marginBottom:"2rem", animation:"fadeIn .35s ease" }}>
        <div style={{ fontSize:10, letterSpacing:3, color:"#b8922a", textTransform:"uppercase", marginBottom:10 }}>
          ✦ Quyền lợi thành viên
        </div>
        <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"2rem", fontWeight:400, color:"#0c0f14", marginBottom:6 }}>
          Điểm & Voucher
        </h1>
        <p style={{ color:"rgba(12,15,20,.45)", fontSize:13 }}>
          Tích điểm mỗi lần đặt phòng · Đổi lấy voucher giảm giá
        </p>
        <div style={{ width:56, height:2, background:"linear-gradient(90deg,#b8922a,transparent)", marginTop:12 }} />
      </div>

      {/* Điểm hiện tại */}
      <div style={{
        background:"linear-gradient(135deg,#0c0f14,#1a1f2a)",
        borderRadius:20, padding:"28px", marginBottom:24,
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:-20, right:-20, width:120, height:120, borderRadius:"50%", background:"rgba(212,175,55,.08)" }} />
        <div style={{ position:"absolute", bottom:-30, left:40, width:80, height:80, borderRadius:"50%", background:"rgba(212,175,55,.05)" }} />
        <div style={{ fontSize:9, letterSpacing:3, color:"#d4af37", textTransform:"uppercase", marginBottom:12 }}>
          ✦ Điểm tích lũy của bạn
        </div>
        <div style={{ fontFamily:"var(--font-serif)", fontSize:"3.5rem", fontWeight:600, color:"#fff", lineHeight:1 }}>
          {info?.points || 0}
          <span style={{ fontSize:16, fontWeight:300, color:"rgba(255,255,255,.4)", marginLeft:8 }}>điểm</span>
        </div>
        <div style={{ fontSize:12, color:"rgba(255,255,255,.35)", marginTop:10 }}>
          Mỗi 100.000 VND = 1 điểm · {activeVouchers.length} voucher đang hoạt động
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:20, background:"rgba(12,15,20,.04)", borderRadius:10, padding:4 }}>
        {[
          { id:"points",   label:"⭐ Đổi điểm" },
          { id:"vouchers", label:`🎫 Voucher (${activeVouchers.length})` },
          { id:"history",  label:"📋 Lịch sử" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex:1, padding:"9px 0", border:"none", borderRadius:8,
            fontFamily:"var(--font-sans)", fontSize:13, fontWeight:500, cursor:"pointer",
            transition:"all .2s",
            background: tab === t.id ? "#fff"               : "transparent",
            color:      tab === t.id ? "#0c0f14"            : "rgba(12,15,20,.45)",
            boxShadow:  tab === t.id ? "0 2px 8px rgba(0,0,0,.08)" : "none",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Đổi điểm */}
      {tab === "points" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {info?.tiers?.map((tier, i) => {
            const canRedeem = (info?.points || 0) >= tier.points;
            return (
              <div key={i} style={{
                background:"#fff",
                border:`1.5px solid ${canRedeem ? "rgba(184,146,42,.2)" : "rgba(12,15,20,.07)"}`,
                borderRadius:14, padding:"20px",
                boxShadow: canRedeem ? "0 4px 16px rgba(184,146,42,.08)" : "none",
                display:"flex", justifyContent:"space-between", alignItems:"center",
                opacity: canRedeem ? 1 : .6,
              }}>
                <div>
                  <div style={{ fontFamily:"var(--font-serif)", fontSize:"1.4rem", fontWeight:600, color:"#b8922a", marginBottom:4 }}>
                    {tier.label}
                  </div>
                  <div style={{ fontSize:13, color:"rgba(12,15,20,.5)" }}>
                    Cần <strong style={{ color:"#0c0f14" }}>{tier.points} điểm</strong> · Hết hạn sau 30 ngày
                  </div>
                  {!canRedeem && (
                    <div style={{ fontSize:11, color:"#c0392b", marginTop:4 }}>
                      Cần thêm {tier.points - (info?.points || 0)} điểm nữa
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleRedeem(i)}
                  disabled={!canRedeem || redeeming}
                  style={{
                    padding:"10px 20px", border:"none", borderRadius:10,
                    background: canRedeem
                      ? "linear-gradient(135deg,#b8922a,#8a6a18)"
                      : "rgba(12,15,20,.1)",
                    color: canRedeem ? "#fff" : "rgba(12,15,20,.3)",
                    fontFamily:"var(--font-sans)", fontSize:13, fontWeight:500,
                    cursor: canRedeem ? "pointer" : "not-allowed", whiteSpace:"nowrap",
                  }}
                >
                  {redeeming ? "..." : "Đổi ngay"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Voucher */}
      {tab === "vouchers" && (
        vouchers.length === 0 ? (
          <div style={{ textAlign:"center", padding:"3rem", color:"rgba(12,15,20,.35)" }}>
            <div style={{ fontSize:"2.5rem", marginBottom:12, opacity:.4 }}>🎫</div>
            <p>Bạn chưa có voucher nào.</p>
            <p style={{ fontSize:12, marginTop:8 }}>Đổi điểm ở tab "Đổi điểm" để nhận voucher.</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {vouchers.map(v => <VoucherCard key={v._id} voucher={v} />)}
          </div>
        )
      )}

      {/* Tab: Lịch sử */}
      {tab === "history" && (
        !info?.logs?.length ? (
          <div style={{ textAlign:"center", padding:"3rem", color:"rgba(12,15,20,.35)" }}>
            <div style={{ fontSize:"2.5rem", marginBottom:12, opacity:.4 }}>📋</div>
            <p>Chưa có lịch sử điểm nào.</p>
          </div>
        ) : (
          <div style={{ background:"#fff", borderRadius:14, overflow:"hidden", border:"1.5px solid rgba(12,15,20,.07)" }}>
            {info.logs.map((log, i) => (
              <div key={log._id} style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"14px 20px",
                borderBottom: i < info.logs.length - 1 ? "1px solid rgba(12,15,20,.06)" : "none",
              }}>
                <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                  <div style={{
                    width:36, height:36, borderRadius:"50%",
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
                    background: log.points > 0 ? "rgba(45,120,85,.1)" : "rgba(184,146,42,.1)",
                  }}>
                    {log.points > 0 ? "⭐" : "🎫"}
                  </div>
                  <div>
                    <div style={{ fontSize:13, color:"#0c0f14", fontWeight:500 }}>{log.note}</div>
                    <div style={{ fontSize:11, color:"rgba(12,15,20,.4)", marginTop:2 }}>
                      {fmtDate(log.createdAt)} · Số dư: {log.balanceAfter} điểm
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize:15, fontWeight:700,
                  color: log.points > 0 ? "#2d7a5f" : "#b8922a",
                }}>
                  {log.points > 0 ? "+" : ""}{log.points} điểm
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
