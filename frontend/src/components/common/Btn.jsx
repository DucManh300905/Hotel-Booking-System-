const variants = {
  primary: (disabled) => ({
    background: disabled ? "rgba(12,15,20,.2)" : "linear-gradient(135deg,#b8922a,#8a6a18)",
    color: "#fff",
    border: "none",
  }),
  ghost: () => ({
    background: "transparent",
    color: "#0c0f14",
    border: "1.5px solid rgba(12,15,20,.1)",
  }),
  danger: (disabled) => ({
    background: disabled ? "rgba(192,57,43,.2)" : "#c0392b",
    color: "#fff",
    border: "none",
  }),
};

export default function Btn({
  children,
  onClick,
  disabled,
  variant = "primary",
  style = {},
  type = "button",
}) {
  const v = (variants[variant] || variants.primary)(disabled);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", padding: 13, ...v, borderRadius: 10,
        fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer", marginTop: 4,
        transition: "opacity .2s", opacity: disabled ? .5 : 1,
        ...style,
      }}
      onMouseOver={(e) => { if (!disabled) e.currentTarget.style.opacity = ".88"; }}
      onMouseOut={(e)  => { if (!disabled) e.currentTarget.style.opacity = "1"; }}
    >
      {children}
    </button>
  );
}
