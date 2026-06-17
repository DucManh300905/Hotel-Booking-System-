/**
 * HTML template email xác thực tài khoản.
 * @param {string} verifyLink - URL chứa rawToken
 */
function verifyEmailTemplate(verifyLink) {
  return `
    <div style="font-family:'Outfit',sans-serif;max-width:480px;margin:0 auto;background:#f8f5ef;padding:2rem;border-radius:12px;">
      <div style="font-size:9px;letter-spacing:3px;color:#d4af37;text-transform:uppercase;margin-bottom:12px;">
        ✦ Hotel Booking System ✦
      </div>
      <h2 style="font-family:'Georgia',serif;color:#0c0f14;margin-bottom:.5rem;font-weight:400;">
        Xác thực tài khoản
      </h2>
      <p style="color:rgba(12,15,20,0.55);font-size:14px;margin-bottom:.5rem;line-height:1.7;">
        Cảm ơn bạn đã đăng ký. Nhấn nút bên dưới để xác thực email và kích hoạt tài khoản.
      </p>
      <p style="color:rgba(12,15,20,0.45);font-size:13px;margin-bottom:1.5rem;">
        Link có hiệu lực trong <strong>24 giờ</strong>.
      </p>
      <a href="${verifyLink}"
        style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#b8922a,#8a6a18);color:#fff;border-radius:9px;text-decoration:none;font-weight:500;font-size:14px;">
        Xác thực Email →
      </a>
      <p style="color:rgba(12,15,20,0.35);font-size:12px;margin-top:1.5rem;">
        Nếu bạn không đăng ký tài khoản này, hãy bỏ qua email.
      </p>
    </div>
  `;
}
 
module.exports = verifyEmailTemplate;