/**
 * Che bớt số CCCD/CMND — chỉ hiển thị 4 số cuối.
 * Ví dụ: "001234567890" → "********7890"
 */
function maskIdNumber(idNumber) {
  if (!idNumber || idNumber.length <= 4) return idNumber;
  return "*".repeat(idNumber.length - 4) + idNumber.slice(-4);
}
 
/**
 * Che bớt số điện thoại — chỉ hiển thị 3 số cuối.
 * Ví dụ: "0901234567" → "*******567"
 */
function maskPhoneNumber(phone) {
  if (!phone || phone.length <= 3) return phone;
  return "*".repeat(phone.length - 3) + phone.slice(-3);
}
 
module.exports = { maskIdNumber, maskPhoneNumber };
 