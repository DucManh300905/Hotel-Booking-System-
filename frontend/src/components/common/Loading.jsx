export default function Loading({ text = "Đang tải..." }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "4rem 2rem", color: "rgba(12,15,20,.35)",
      fontFamily: "var(--font-sans)",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        border: "3px solid rgba(184,146,42,.15)",
        borderTopColor: "#b8922a",
        animation: "spin .7s linear infinite",
        marginBottom: 16,
      }} />
      <p style={{ fontSize: 13 }}>{text}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
