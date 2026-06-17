export default function Modal({
  title, sub, children, onClose,
  confirmText, danger, onConfirm, loading,
}) {
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, background: "rgba(12,15,20,.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 16, backdropFilter: "blur(5px)",
      }}
    >
      <div style={{
        background: "#fff", borderRadius: 18, padding: 32,
        width: "100%", maxWidth: 440,
        boxShadow: "0 24px 64px rgba(0,0,0,.16)",
        fontFamily: "var(--font-sans)", animation: "scaleIn .2s ease",
      }}>
        <h3 style={{
          fontFamily: "var(--font-serif)", fontSize: "1.5rem",
          fontWeight: 400, color: "#0c0f14", marginBottom: 6,
        }}>
          {title}
        </h3>
        {sub && (
          <p style={{ color: "rgba(12,15,20,.45)", fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>
            {sub}
          </p>
        )}

        {children}

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "11px 0",
              background: "rgba(12,15,20,.04)",
              border: "1.5px solid rgba(12,15,20,.08)", borderRadius: 10,
              fontFamily: "var(--font-sans)", fontSize: 14,
              cursor: "pointer", color: "#0c0f14",
            }}
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 2, padding: "11px 0", border: "none", borderRadius: 10,
              fontFamily: "var(--font-sans)", fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer",
              color: "#fff", fontWeight: 500,
              background: danger
                ? "#c0392b"
                : "linear-gradient(135deg,#b8922a,#8a6a18)",
              opacity: loading ? .5 : 1,
            }}
          >
            {loading ? "Đang xử lý..." : confirmText || "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
}
