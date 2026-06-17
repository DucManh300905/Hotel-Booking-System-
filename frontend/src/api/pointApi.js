import axiosClient from "./axiosClient";
 
const pointApi = {
  getInfo:         ()     => axiosClient.get("/points"),
  getVouchers:     ()     => axiosClient.get("/points/vouchers"),
  redeem:          (i)    => axiosClient.post("/points/redeem", { tierIndex: i }),
  validateVoucher: (code) => axiosClient.post("/points/validate-voucher", { code }),
};
 
export default pointApi;