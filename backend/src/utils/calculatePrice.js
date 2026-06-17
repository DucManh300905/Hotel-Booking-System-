/**
 * Tính số đêm giữa checkIn và checkOut.
 * Tối thiểu 1 đêm.
 */
function calculateNights(checkIn, checkOut) {
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
 
/**
 * Tính tổng tiền = số đêm × giá phòng.
 */
function calculateTotalPrice(checkIn, checkOut, pricePerNight) {
  const nights = calculateNights(checkIn, checkOut);
  return nights * pricePerNight;
}
 
module.exports = { calculateNights, calculateTotalPrice };