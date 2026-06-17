import { createContext, useState, useEffect, useCallback } from "react";
import { parseJwt } from "../utils/maskIdNumber";
import authApi from "../api/authApi";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token,   setToken]   = useState(() => localStorage.getItem("token") || "");
  const [user,    setUser]    = useState(null);  // { id, role, exp }

  // Đồng bộ user từ token
  useEffect(() => {
    if (token) {
      const decoded = parseJwt(token);
      // Kiểm tra token hết hạn
      if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
        logout();
      } else {
        setUser(decoded);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = useCallback((newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  }, []);

  const value = {
    token,
    user,
    role:        user?.role || "user",
    isLoggedIn:  !!token,
    isAdmin:     user?.role === "admin",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
