const getTransporter          = require("../config/mail");
const verifyEmailTemplate     = require("../templates/verifyEmail.template");
const resetPasswordTemplate   = require("../templates/resetPassword.template");

async function sendVerificationEmail(to, rawToken) {
  const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}`;

  await getTransporter().sendMail({
    from: `"Hotel Booking System" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Xác thực tài khoản — Hotel Booking System",
    html: verifyEmailTemplate(verifyLink),
  });
}

async function sendResetPasswordEmail(to, rawToken) {
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;

  await getTransporter().sendMail({
    from: `"Hotel Booking System" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Đặt lại mật khẩu — Hotel Booking System",
    html: resetPasswordTemplate(resetLink),
  });
}

module.exports = { sendVerificationEmail, sendResetPasswordEmail };
