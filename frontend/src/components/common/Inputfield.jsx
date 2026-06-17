import { useState } from "react";

export default function InputField({ label, hint, icon, ...props }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{
          display: "block", fontSize: 11, letterSpacing: "1.5px",
          textTransform: "uppercase", color: "rgba(12,15,20,.45)",
          marginBottom: 7, fontWeight: 500,
        }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{
            position: "absolute", left: 12, top: "50%",
            transform: "translateY(-50%)",
            fontSize: 14, opacity: .4, pointerEvents: "none",
          }}>
            {icon}
          </span>
        )}
        <input
          {...props}
          style={{
            width: "100%",
            padding: icon ? "11px 14px 11px 36px" : "11px 14px",
            border: `1.5px solid ${focused ? "rgba(184,146,42,.5)" : "rgba(12,15,20,.09)"}`,
            borderRadius: 10, fontFamily: "var(--font-sans)", fontSize: 14,
            background: "#fafafa", color: "#0c0f14", outline: "none",
            boxSizing: "border-box", transition: "border-color .2s, box-shadow .2s",
            boxShadow: focused ? "0 0 0 3px rgba(184,146,42,.08)" : "none",
          }}
          onFocus={(e) => { setFocused(true);  props.onFocus?.(e); }}
          onBlur={(e)  => { setFocused(false); props.onBlur?.(e);  }}
        />
      </div>
      {hint && (
        <p style={{ fontSize: 11, color: "rgba(12,15,20,.35)", marginTop: 5 }}>
          {hint}
        </p>
      )}
    </div>
  );
}
