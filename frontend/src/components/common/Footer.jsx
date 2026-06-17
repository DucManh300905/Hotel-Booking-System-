export default function Footer() {
  return (
    <footer style={{
      background: "#0c0f14", color: "rgba(255,255,255,.25)",
      textAlign: "center", padding: "1.5rem",
      fontFamily: "var(--font-sans)", fontSize: 12,
      borderTop: "1px solid rgba(255,255,255,.05)",
    }}>
      © {new Date().getFullYear()} Hotel Booking System · All rights reserved
    </footer>
  );
}
