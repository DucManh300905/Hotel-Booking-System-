import axiosClient from "./axiosClient";
 
const authApi = {
  register: (data)        => axiosClient.post("/auth/register", data),
  login:    (data)        => axiosClient.post("/auth/login", data),
  logout:   ()            => axiosClient.post("/auth/logout"),
  forgotPassword: (email) => axiosClient.post("/auth/forgot-password", { email }),
  resetPassword:  (token, password, confirm) =>
    axiosClient.post(`/auth/reset-password?token=${token}`, { password, confirm }),
};
 
export default authApi;