import axiosClient from "./axiosClient";

const bookingApi = {
  create:       (data)        => axiosClient.post("/bookings", data),
  getMy:        ()            => axiosClient.get("/bookings/my"),
  getAll:       ()            => axiosClient.get("/bookings"),
  confirm:      (id)          => axiosClient.patch(`/bookings/${id}/confirm`),
  cancel:       (id)          => axiosClient.patch(`/bookings/${id}/cancel`),
  lookupByPhone: (phoneNumber) => axiosClient.post("/bookings/lookup", { phoneNumber }),
};

export default bookingApi;
