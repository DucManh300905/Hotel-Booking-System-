import { fmtPrice } from "../../utils/calculateNights";

const BANK_ID      = "970422";
const ACCOUNT_NO   = "1234567890";
const ACCOUNT_NAME = "NGUYEN VAN A";

function buildQRUrl(amount, qrDescription) {
  return `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(qrDescription)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
}

export default function QRDepositModal({ booking, onClose }) {
  if (!booking) return null;

  const deposit     = booking.depositAmount || Math.ceil((booking.finalPrice || booking.totalPrice) / 2);
  const shortId     = String(booking._id).slice(-8).toUpperCase();
  const qrDesc      = booking.qrDescription || `BOOKING-${shortId}-AMOUNT-${deposit}`;
  const qrUrl       = buildQRUrl(deposit, qrDesc);
  const hasDiscount = booking.discountAmount > 0;

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position:"fixed", inset:0, background:"rgba(12,15,20,.6)",
        display:"flex", alignItems:"center", justifyContent:"center",
        zIndex:2000, padding:16, backdropFilter:"blur(6px)",
      }}
    >
      <div style={{
        background:"#fff", borderRadius:20, width:"100%", maxWidth:420,
        boxShadow:"0 28px 72px rgba(0,0,0,.2)", overflow:"hidden",
        animation:"scaleIn .22s ease", fontFamily:"var(--font-sans)",
      }}>
        {/* Header */}
        <div style={{ background:"#0c0f14", padding:"20px 24px" }}>
          <div style={{ fontSize:9, letterSpacing:3, color:"#d4af37", textTransform:"uppercase", marginBottom:6 }}>
            ✦ Xác nhận đặt phòng
          </div>
          <div style={{ color:"#fff", fontFamily:"var(--font-serif)", fontSize:"1.3rem", fontWeight:400 }}>
            Chuyển khoản đặt cọc
          </div>
          <div style={{ color:"rgba(255,255,255,.4)", fontSize:12, marginTop:4 }}>
            Mã booking: #{shortId}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:"20px 24px" }}>

          {/* Số tiền */}
          <div style={{
            background:"rgba(184,146,42,.06)", border:"1px solid rgba(184,146,42,.2)",
            borderRadius:12, padding:"14px 16px", marginBottom:20,
          }}>
            {hasDiscount && (
              <div style={{
                display:"flex", justifyContent:"space-between",
                fontSize:12, color:"#2d7a5f", marginBottom:8,
                padding:"6px 10px", background:"rgba(45,120,85,.08)",
                borderRadius:8, border:"1px solid rgba(45,120,85,.2)",
              }}>
                <span>🎫 Voucher giảm</span>
                <span>- {fmtPrice(booking.discountAmount)} VND</span>
              </div>
            )}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:11, color:"rgba(12,15,20,.4)", marginBottom:4 }}>
                  Tiền cọc (50%{hasDiscount ? " sau giảm" : ""})
                </div>
                <div style={{ fontSize:22, fontWeight:700, color:"#b8922a" }}>
                  {fmtPrice(deposit)} VND
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:11, color:"rgba(12,15,20,.4)", marginBottom:4 }}>Tổng tiền phòng</div>
                {hasDiscount ? (
                  <>
                    <div style={{ fontSize:12, color:"rgba(12,15,20,.35)", textDecoration:"line-through" }}>
                      {fmtPrice(booking.totalPrice)} VND
                    </div>
                    <div style={{ fontSize:14, fontWeight:600, color:"#0c0f14" }}>
                      {fmtPrice(booking.finalPrice)} VND
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize:14, color:"rgba(12,15,20,.5)" }}>
                    {fmtPrice(booking.totalPrice)} VND
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* QR */}
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <div style={{ fontSize:12, color:"rgba(12,15,20,.45)", marginBottom:12 }}>
              Quét mã QR bằng app ngân hàng để chuyển khoản
            </div>
            <div style={{
              display:"inline-block", padding:12,
              border:"1.5px solid rgba(12,15,20,.08)", borderRadius:16,
              background:"#fff", boxShadow:"0 4px 20px rgba(0,0,0,.06)",
            }}>
              <img
                src={qrUrl} alt="QR chuyển khoản"
                width={200} height={200}
                style={{ display:"block", borderRadius:8 }}
                onError={e => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div style={{
                display:"none", width:200, height:200,
                alignItems:"center", justifyContent:"center",
                flexDirection:"column", gap:8,
                background:"rgba(12,15,20,.03)", borderRadius:8,
                color:"rgba(12,15,20,.4)", fontSize:12,
              }}>
                <span style={{ fontSize:32 }}>📵</span>
                <span>Không tải được QR</span>
              </div>
            </div>

            <div style={{ marginTop:14, fontSize:12, color:"rgba(12,15,20,.5)", lineHeight:1.8 }}>
              <div>Ngân hàng: <strong style={{ color:"#0c0f14" }}>MB Bank</strong></div>
              <div>Số TK: <strong style={{ color:"#0c0f14", fontFamily:"monospace" }}>{ACCOUNT_NO}</strong></div>
              <div>Chủ TK: <strong style={{ color:"#0c0f14" }}>{ACCOUNT_NAME}</strong></div>
              <div>Nội dung: <strong style={{ color:"#b8922a", fontFamily:"monospace", fontSize:11 }}>{qrDesc}</strong></div>
            </div>
          </div>

          {/* Lưu ý */}
          <div style={{
            background:"rgba(43,74,122,.05)", border:"1px solid rgba(43,74,122,.15)",
            borderRadius:10, padding:"12px 14px", marginBottom:20,
            fontSize:12, color:"rgba(12,15,20,.55)", lineHeight:1.7,
          }}>
            ℹ️ Sau khi chuyển khoản, admin sẽ xác nhận trong vòng <strong>15–30 phút</strong>.
            {booking.isGuest && (
              <> Dùng <strong>số điện thoại</strong> để tra cứu booking tại "Tra cứu booking".</>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={onClose} style={{
              flex:1, padding:"11px 0", background:"transparent",
              border:"1.5px solid rgba(12,15,20,.09)", borderRadius:10,
              fontFamily:"var(--font-sans)", fontSize:14, cursor:"pointer", color:"#0c0f14",
            }}>Đóng</button>
            <button onClick={onClose} style={{
              flex:2, padding:"11px 0", border:"none", borderRadius:10,
              background:"linear-gradient(135deg,#b8922a,#8a6a18)",
              color:"#fff", fontFamily:"var(--font-sans)",
              fontSize:14, fontWeight:500, cursor:"pointer",
            }}>Đã chuyển khoản ✓</button>
          </div>
        </div>
      </div>
    </div>
  );
}
