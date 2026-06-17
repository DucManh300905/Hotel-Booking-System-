const crypto = require("crypto");
 
const ALGORITHM = "aes-256-gcm";
 
function getKey() {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error("ENCRYPTION_KEY phải là chuỗi hex 64 ký tự trong .env");
  }
  return Buffer.from(hex, "hex");
}
 
/**
 * Mã hóa plaintext → "<iv>:<authTag>:<ciphertext>" (hex)
 */
function encrypt(plaintext) {
  const key    = getKey();
  const iv     = crypto.randomBytes(12); // 96-bit IV cho GCM
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
 
  const encrypted = Buffer.concat([
    cipher.update(String(plaintext), "utf8"),
    cipher.final(),
  ]);
 
  const authTag = cipher.getAuthTag();
 
  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}
 
/**
 * Giải mã "<iv>:<authTag>:<ciphertext>" → plaintext
 * Throw nếu data bị tamper hoặc key sai.
 */
function decrypt(encryptedStr) {
  const key = getKey();
  const parts = encryptedStr.split(":");
 
  if (parts.length !== 3) {
    throw new Error("Định dạng dữ liệu mã hóa không hợp lệ");
  }
 
  const [ivHex, authTagHex, cipherHex] = parts;
 
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(ivHex, "hex")
  );
 
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
 
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(cipherHex, "hex")),
    decipher.final(),
  ]);
 
  return decrypted.toString("utf8");
}
 
/**
 * Nhận GuestInfo document (raw từ DB) → trả về object đã decrypt.
 * Throw nếu bất kỳ field nào không giải mã được.
 */
function decryptGuestInfo(guestInfo) {
  return {
    _id:         guestInfo._id,
    fullName:    decrypt(guestInfo.fullName),
    phoneNumber: decrypt(guestInfo.phoneNumber),
    idNumber:    decrypt(guestInfo.idNumber),
  };
}
 
module.exports = { encrypt, decrypt, decryptGuestInfo };