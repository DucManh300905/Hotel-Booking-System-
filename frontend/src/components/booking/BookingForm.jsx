import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import bookingApi from "../../api/bookingApi";
import pointApi from "../../api/pointApi";
import InputField from "../common/InputField";
import Btn from "../common/Btn";
import QRDepositModal from "./QRDepositModal";
import { fmtPrice, calculateNights } from "../../utils/calculateNights";
import { fmtDate, todayISO, tomorrowISO, minCheckout } from "../../utils/formatDate";

function SectionLabel({ icon, label }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14, marginTop:4 }}>
      <span style={{ fontSize:13 }}>{icon}</span>
      <span style={{ fontSize:10, letterSpacing:2.5, textTransform:"uppercase", fontWeight:600, color:"rgba(12,15,20,.4)" }}>
        {label}
      </span>
      <div style={{ flex:1, height:1, background:"rgba(12,15,20,.07)" }} />
    </div>
  );
}

export default function BookingForm({ room, onClose, onSuccess, showToast }) {
  const { isLoggedIn } = useAuth();
  const navigate       = useNavigate();

  const [step,        setStep]        = useState("dates");
  const [checkIn,     setCheckIn]     = useState(todayISO());
  const [checkOut,    setCheckOut]    = useState(tomorrowISO());
  const [fullName,    setFullName]    = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idNumber,    setIdNumber]    = useState("");
  const [loading,     setLoading]     = useState(false);
  const [qrBooking,   setQrBooking]   = useState(null);

  const [voucherCode,    setVoucherCode]    = useState("");
  const [voucherInfo,    setVoucherInfo]    = useState(null); // data từ validate API
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherError,   setVoucherError]   = useState(null);

  const nights     = calculateNights(checkIn, checkOut);
  const totalPrice = nights * room.price;

  // Giới hạn voucher tối đa 50% tổng giá trị phòng (đồng bộ với backend)
  const MAX_VOUCHER_RATIO = 0.5;
  const maxDiscount       = Math.floor(totalPrice * MAX_VOUCHER_RATIO);

  // Tính discount thực tế sau khi áp cap
  const rawDiscount    = voucherInfo?.discountAmount || 0;
  const discount       = Math.min(rawDiscount, maxDiscount);
  const voucherCapped  = voucherInfo && rawDiscount > maxDiscount; // true nếu bị giới hạn

  const finalPrice    = Math.max(0, totalPrice - discount);
  const depositAmount = Math.ceil(finalPrice / 2);
  const pointsToEarn  = isLoggedIn ? Math.floor(finalPrice / 100000) : 0;

  const goToGuest = () => {
    if (new Date(checkOut) <= new Date(checkIn)) {
      showToast("Ngày trả phòng phải sau ngày nhận phòng", "error"); return;
    }
    setStep("guest");
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setVoucherLoading(true);
    setVoucherError(null);
    try {
      const data = await pointApi.validateVoucher(voucherCode.trim());
      setVoucherInfo(data);

      // Tính cap tại thời điểm apply để hiển thị toast chính xác
      const capNow      = Math.floor(totalPrice * MAX_VOUCHER_RATIO);
      const actualSaved = Math.min(data.discountAmount, capNow);
      const wasCapped   = data.discountAmount > capNow;

      if (wasCapped) {
        showToast(
          `Áp dụng thành công! Voucher giảm ${fmtPrice(data.discountAmount)} VND nhưng chỉ được giảm tối đa 50% giá phòng (${fmtPrice(capNow)} VND).`,
          "info"
        );
      } else {
        showToast(`Áp dụng thành công! Giảm ${fmtPrice(actualSaved)} VND`, "success");
      }
    } catch (e) {
      setVoucherError(e.message);
      setVoucherInfo(null);
    }
    setVoucherLoading(false);
  };

  const handleRemoveVoucher = () => {
    setVoucherCode(""); setVoucherInfo(null); setVoucherError(null);
  };

  const handleBook = async () => {
    if (!fullName.trim() || fullName.trim().length < 2) {
      showToast("Họ và tên phải có ít nhất 2 ký tự", "error"); return;
    }
    if (!/^[0-9]{9,11}$/.test(phoneNumber.trim())) {
      showToast("Số điện thoại không hợp lệ (9–11 chữ số)", "error"); return;
    }
    if (!/^[0-9]{9,12}$/.test(idNumber.trim())) {
      showToast("Số CCCD/CMND không hợp lệ (9–12 chữ số)", "error"); return;
    }
    setLoading(true);
    try {
      const data = await bookingApi.create({
        roomId: room._id, checkIn, checkOut,
        fullName:    fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        idNumber:    idNumber.trim(),
        voucherCode: voucherInfo?.code || undefined,
      });
      setQrBooking(data.booking ?? data); // compat nếu backend trả thẳng object
    } catch (e) {
      showToast(e.message, "error");
    }
    setLoading(false);
  };

  const handleQRClose = () => {
    setQrBooking(null);
    showToast(
      isLoggedIn
        ? `Đặt phòng thành công! Bạn sẽ nhận ${pointsToEarn} điểm sau khi xác nhận.`
        : "Đặt phòng thành công! Dùng SĐT để tra cứu booking.",
      "success"
    );
    onSuccess?.();
  };

  const dateInputStyle = {
    width:"100%", padding:"10px 12px",
    border:"1.5px solid rgba(12,15,20,.09)", borderRadius:10,
    fontFamily:"var(--font-sans)", fontSize:13,
    background:"#fafafa", color:"#0c0f14",
    outline:"none", boxSizing:"border-box",
  };

  if (qrBooking) return <QRDepositModal booking={qrBooking} onClose={handleQRClose} />;

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position:"fixed", inset:0, background:"rgba(12,15,20,.55)",
        display:"flex", alignItems:"center", justifyContent:"center",
        zIndex:1000, padding:16, backdropFilter:"blur(6px)", overflowY:"auto",
      }}
    >
      <div style={{
        background:"#fff", borderRadius:20, width:"100%", maxWidth:480,
        boxShadow:"0 28px 72px rgba(0,0,0,.18)", overflow:"hidden",
        animation:"scaleIn .22s ease", margin:"auto",
      }}>
        {/* Header */}
        <div style={{ background:"#0c0f14", padding:"24px 28px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:9, letterSpacing:3, color:"#d4af37", textTransform:"uppercase", marginBottom:8 }}>
                ✦ {step === "dates" ? "Chọn ngày" : "Thông tin khách"}
              </div>
              <div style={{ color:"#fff", fontSize:"1.25rem", fontFamily:"var(--font-serif)", fontWeight:400 }}>
                {room.name}
              </div>
              <div style={{ color:"rgba(255,255,255,.4)", fontSize:13, marginTop:4 }}>
                {fmtPrice(room.price)} VND / đêm
              </div>
            </div>
            <div style={{ display:"flex", gap:6, alignItems:"center", paddingTop:4 }}>
              {["dates","guest"].map(s => (
                <div key={s} style={{
                  width: step === s ? 20 : 8, height:8, borderRadius:4,
                  background: step === s ? "#d4af37"
                    : step === "guest" && s === "dates" ? "rgba(212,175,55,.5)"
                    : "rgba(255,255,255,.2)",
                  transition:"all .3s",
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:"24px 28px 28px" }}>

          {!isLoggedIn && (
            <div style={{
              background:"rgba(43,74,122,.06)", border:"1px solid rgba(43,74,122,.2)",
              borderRadius:10, padding:"10px 14px", marginBottom:16,
              fontSize:12, color:"#2b4a7a", display:"flex", gap:8,
            }}>
              <span>💡</span>
              <span>
                <strong>Đăng nhập để tích điểm & dùng voucher!</strong>{" "}
                <span
                  onClick={() => { onClose(); navigate("/login"); }}
                  style={{ textDecoration:"underline", cursor:"pointer" }}
                >
                  Đăng nhập ngay
                </span>
              </span>
            </div>
          )}

          {/* Step 1: Dates + Voucher + Summary */}
          {step === "dates" && (
            <>
              <SectionLabel icon="📅" label="Chọn ngày lưu trú" />

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
                <div>
                  <div style={{ fontSize:11, color:"rgba(12,15,20,.4)", marginBottom:6 }}>Nhận phòng</div>
                  <input
                    type="date" value={checkIn}
                    min={todayISO()}
                    onChange={e => {
                      setCheckIn(e.target.value);
                      if (checkOut <= e.target.value) setCheckOut(minCheckout(e.target.value));
                    }}
                    style={dateInputStyle}
                  />
                </div>
                <div>
                  <div style={{ fontSize:11, color:"rgba(12,15,20,.4)", marginBottom:6 }}>Trả phòng</div>
                  <input
                    type="date" value={checkOut}
                    min={minCheckout(checkIn)}
                    onChange={e => setCheckOut(e.target.value)}
                    style={dateInputStyle}
                  />
                </div>
              </div>

              {/* Voucher — chỉ hiện khi đã login */}
              {isLoggedIn && (
                <div style={{ marginBottom:16 }}>
                  <SectionLabel icon="🎫" label="Mã voucher (tuỳ chọn)" />
                  {voucherInfo ? (
                    <>
                      <div style={{
                        display:"flex", justifyContent:"space-between", alignItems:"center",
                        padding:"10px 14px", borderRadius:10,
                        background:"rgba(45,120,85,.08)", border:"1px solid rgba(45,120,85,.25)",
                      }}>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:"#2d7a5f", fontFamily:"monospace" }}>
                            {voucherInfo.code}
                          </div>
                          <div style={{ fontSize:11, color:"#2d7a5f", marginTop:2 }}>
                            {voucherCapped
                              ? <>Giảm <s style={{ opacity:.5 }}>{fmtPrice(rawDiscount)}</s> → <strong>{fmtPrice(discount)} VND</strong> (tối đa 50%)</>
                              : <>Giảm {fmtPrice(discount)} VND</>
                            }
                          </div>
                        </div>
                        <button onClick={handleRemoveVoucher} style={{
                          background:"none", border:"none", cursor:"pointer",
                          color:"#c0392b", fontSize:18, lineHeight:1,
                        }}>✕</button>
                      </div>
                      {/* Cảnh báo cap voucher */}
                      {voucherCapped && (
                        <div style={{
                          marginTop:6, padding:"8px 12px", borderRadius:8,
                          background:"rgba(184,146,42,.08)", border:"1px solid rgba(184,146,42,.25)",
                          fontSize:11, color:"#8a6a18", lineHeight:1.5,
                        }}>
                          ⚠️ Voucher chỉ được giảm tối đa 50% giá trị phòng. Phần còn lại ({fmtPrice(rawDiscount - discount)} VND) không được áp dụng.
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ display:"flex", gap:8 }}>
                      <input
                        placeholder="VD: HBS-A1B2C3"
                        value={voucherCode}
                        onChange={e => setVoucherCode(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === "Enter" && handleApplyVoucher()}
                        style={{
                          flex:1, padding:"10px 12px",
                          border:`1.5px solid ${voucherError ? "rgba(192,57,43,.4)" : "rgba(12,15,20,.09)"}`,
                          borderRadius:10, fontFamily:"monospace", fontSize:13,
                          background:"#fafafa", color:"#0c0f14", outline:"none",
                        }}
                      />
                      <button
                        onClick={handleApplyVoucher}
                        disabled={!voucherCode.trim() || voucherLoading}
                        style={{
                          padding:"10px 16px", border:"none", borderRadius:10,
                          background: voucherCode.trim() ? "linear-gradient(135deg,#b8922a,#8a6a18)" : "rgba(12,15,20,.1)",
                          color: voucherCode.trim() ? "#fff" : "rgba(12,15,20,.3)",
                          fontFamily:"var(--font-sans)", fontSize:13, fontWeight:500,
                          cursor: voucherCode.trim() ? "pointer" : "not-allowed", whiteSpace:"nowrap",
                        }}
                      >
                        {voucherLoading ? "..." : "Áp dụng"}
                      </button>
                    </div>
                  )}
                  {voucherError && (
                    <div style={{ fontSize:11, color:"#c0392b", marginTop:6 }}>✕ {voucherError}</div>
                  )}
                </div>
              )}

              {/* Summary */}
              <div style={{
                background:"rgba(184,146,42,.06)", border:"1px solid rgba(184,146,42,.2)",
                borderRadius:12, padding:"14px 16px", marginBottom:16,
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"rgba(12,15,20,.55)", marginBottom:4 }}>
                  <span>{fmtPrice(room.price)} × {nights} đêm</span>
                  <span>{fmtPrice(totalPrice)} VND</span>
                </div>
                {discount > 0 && (
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#2d7a5f", marginBottom:4 }}>
                    <span>🎫 Voucher giảm{voucherCapped ? " (giới hạn 50%)" : ""}</span>
                    <span>- {fmtPrice(discount)} VND</span>
                  </div>
                )}
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"rgba(12,15,20,.55)", marginBottom:6 }}>
                  <span>Tiền cọc (50%{discount > 0 ? " sau giảm" : ""})</span>
                  <span style={{ color:"#b8922a" }}>{fmtPrice(depositAmount)} VND</span>
                </div>
                <div style={{
                  borderTop:"1px solid rgba(184,146,42,.2)", paddingTop:8,
                  display:"flex", justifyContent:"space-between", fontSize:16, fontWeight:600,
                }}>
                  <span style={{ color:"#0c0f14" }}>Tổng thanh toán</span>
                  <div style={{ textAlign:"right" }}>
                    {discount > 0 && (
                      <div style={{ fontSize:11, color:"rgba(12,15,20,.35)", textDecoration:"line-through" }}>
                        {fmtPrice(totalPrice)} VND
                      </div>
                    )}
                    <span style={{ color:"#b8922a" }}>{fmtPrice(finalPrice)} VND</span>
                  </div>
                </div>
              </div>

              {isLoggedIn && pointsToEarn > 0 && (
                <div style={{
                  background:"rgba(45,120,85,.06)", border:"1px solid rgba(45,120,85,.2)",
                  borderRadius:10, padding:"10px 14px", marginBottom:16,
                  fontSize:12, color:"#2d7a5f",
                }}>
                  ⭐ Bạn sẽ nhận <strong>{pointsToEarn} điểm</strong> sau khi booking được xác nhận
                </div>
              )}

              <div style={{ display:"flex", gap:10 }}>
                <button onClick={onClose} style={{
                  flex:1, padding:12, background:"transparent",
                  border:"1.5px solid rgba(12,15,20,.09)", borderRadius:10,
                  fontFamily:"var(--font-sans)", fontSize:14, cursor:"pointer", color:"#0c0f14",
                }}>Hủy</button>
                <Btn onClick={goToGuest} style={{ flex:2, marginTop:0 }}>
                  Tiếp theo → Thông tin khách
                </Btn>
              </div>
            </>
          )}

          {/* Step 2: Guest info */}
          {step === "guest" && (
            <>
              <SectionLabel icon="🧑‍💼" label="Thông tin khách hàng" />
              <InputField label="Họ và tên" placeholder="Nguyễn Văn A" icon="👤"
                value={fullName} onChange={e => setFullName(e.target.value)}
                hint="Nhập đầy đủ họ và tên như trên giấy tờ tùy thân" />
              <InputField label="Số điện thoại" placeholder="0901234567" icon="📞"
                type="tel" inputMode="numeric" maxLength={11}
                value={phoneNumber} onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                hint="9–11 chữ số · Dùng để tra cứu booking sau này" />
              <InputField label="Số CCCD / CMND" placeholder="001234567890" icon="🪪"
                type="text" inputMode="numeric" maxLength={12}
                value={idNumber} onChange={e => setIdNumber(e.target.value.replace(/\D/g, ""))}
                hint="9–12 chữ số (CMND 9 số · CCCD 12 số)" />

              {/* Mini summary ở bước 2 */}
              <div style={{
                background:"rgba(12,15,20,.03)", border:"1px solid rgba(12,15,20,.07)",
                borderRadius:10, padding:"12px 14px", marginBottom:18,
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <div style={{ fontSize:12, color:"rgba(12,15,20,.4)" }}>
                    {room.name} · {nights} đêm
                  </div>
                  <div style={{ fontSize:12, color:"rgba(12,15,20,.35)" }}>
                    {fmtDate(checkIn)} → {fmtDate(checkOut)}
                  </div>
                </div>
                {discount > 0 && (
                  <div style={{ fontSize:12, color:"#2d7a5f", marginBottom:4 }}>
                    🎫 Voucher giảm {fmtPrice(discount)} VND
                    {voucherCapped && <span style={{ opacity:.65 }}> (giới hạn 50%)</span>}
                  </div>
                )}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    {discount > 0 && (
                      <div style={{ fontSize:11, color:"rgba(12,15,20,.35)", textDecoration:"line-through" }}>
                        {fmtPrice(totalPrice)} VND
                      </div>
                    )}
                    <div style={{ fontSize:14, fontWeight:600, color:"#b8922a" }}>{fmtPrice(finalPrice)} VND</div>
                    <div style={{ fontSize:11, color:"rgba(12,15,20,.4)" }}>Cọc: {fmtPrice(depositAmount)} VND</div>
                  </div>
                  {isLoggedIn && pointsToEarn > 0 && (
                    <div style={{ fontSize:11, color:"#2d7a5f" }}>⭐ +{pointsToEarn} điểm</div>
                  )}
                </div>
              </div>

              <div style={{ display:"flex", gap:10 }}>
                <button onClick={() => setStep("dates")} style={{
                  flex:1, padding:12, background:"transparent",
                  border:"1.5px solid rgba(12,15,20,.09)", borderRadius:10,
                  fontFamily:"var(--font-sans)", fontSize:14, cursor:"pointer", color:"#0c0f14",
                }}>← Quay lại</button>
                <Btn onClick={handleBook} disabled={loading} style={{ flex:2, marginTop:0 }}>
                  {loading ? "Đang xử lý..." : "Xác nhận & Thanh toán →"}
                </Btn>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
