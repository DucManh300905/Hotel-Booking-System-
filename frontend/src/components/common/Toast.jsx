export default function Toast({ toast }) {
  if (!toast) return null;

  const cfg = {
    success: { bg:"#f0faf5", border:"rgba(45,120,85,.25)",  color:"#2d7a5f", icon:"✓" },
    error:   { bg:"#fff5f5", border:"rgba(192,57,43,.25)",  color:"#c0392b", icon:"✕" },
    info:    { bg:"#f0f4fa", border:"rgba(43,74,122,.25)",  color:"#2b4a7a", icon:"ℹ" },
    warning: { bg:"#fdf8f0", border:"rgba(184,146,42,.3)",  color:"#8a6a18", icon:"⚠" },
  };
  const c = cfg[toast.type] || cfg.info;

  return (
    <div style={{
      position:"fixed", top:20, right:20, zIndex:9999,
      padding:"12px 20px", borderRadius:12, fontSize:13, fontWeight:500,
      display:"flex", alignItems:"center", gap:8,
      background:c.bg, border:`1px solid ${c.border}`, color:c.color,
      boxShadow:"0 4px 20px rgba(0,0,0,.12)", fontFamily:"var(--font-sans)",
      animation:"fadeIn .25s ease",
    }}>
      {c.icon} {toast.text}
    </div>
  );
}
